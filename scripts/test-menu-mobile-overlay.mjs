import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.MENU_MOBILE_TEST_URL || "http://127.0.0.1:4173/";
const viewport = { width: 390, height: 1000 };
const modes = ["reduced", "full"];

async function openPage(browser, mode) {
    const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        reducedMotion: "no-preference",
    });

    await context.addInitScript((selectedMode) => {
        try {
            localStorage.setItem("experienceMode", selectedMode);
        } catch {
            // The about:blank origin may not expose localStorage.
        }
    }, mode);

    const page = await context.newPage();
    await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    await page.waitForSelector('button[aria-label="Abrir menu"]', { timeout: 30000 });
    await page.waitForTimeout(1000);

    return { context, page };
}

async function inspectStacking(page) {
    return page.evaluate(() => {
        const overlay = document.querySelector("[data-mobile-menu-overlay]");
        const socialsButton = document.querySelector(
            'button[aria-label="Arraste para abrir as redes sociais"]',
        );

        if (!overlay) {
            return { overlayExists: false, socialsExists: Boolean(socialsButton) };
        }

        if (!socialsButton) {
            return {
                overlayExists: true,
                socialsExists: false,
                overlayZIndex: getComputedStyle(overlay).zIndex,
            };
        }

        const rect = socialsButton.getBoundingClientRect();
        const intersectsViewport =
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            rect.right > 0 &&
            rect.left < window.innerWidth;

        const x = Math.min(window.innerWidth - 2, Math.max(2, rect.left + rect.width / 2));
        const y = Math.min(window.innerHeight - 2, Math.max(2, rect.top + rect.height / 2));
        const target = document.elementFromPoint(x, y);

        return {
            overlayExists: true,
            socialsExists: true,
            socialsIntersectsViewport: intersectsViewport,
            overlayZIndex: getComputedStyle(overlay).zIndex,
            socialsRect: {
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
            },
            hitBelongsToOverlay: Boolean(target && overlay.contains(target)),
            hitIsSocialButton: Boolean(
                target && (target === socialsButton || socialsButton.contains(target)),
            ),
            hitTag: target?.tagName ?? null,
            hitLabel: target?.getAttribute("aria-label") ?? null,
        };
    });
}

async function testMenuOverlayAndScrollLock(browser, mode) {
    const { context, page } = await openPage(browser, mode);

    try {
        console.log("Testing mobile menu overlay and page scroll lock: mode=" + mode);

        await page.locator('button[aria-label="Abrir menu"]').click();
        await page.waitForSelector("[data-mobile-menu-overlay]", {
            state: "visible",
            timeout: 10000,
        });
        await page.waitForSelector('[data-mobile-menu] button[aria-label="Fechar menu"]', {
            state: "visible",
            timeout: 10000,
        });

        const stacking = await inspectStacking(page);
        assert.ok(stacking.overlayExists, "Mobile menu overlay must exist. " + JSON.stringify(stacking));
        assert.ok(stacking.socialsExists, "Socials drag button should remain in the DOM behind the overlay.");
        assert.equal(
            stacking.overlayZIndex,
            "9999",
            "Mobile menu should use a high global stacking layer. " + JSON.stringify(stacking),
        );

        if (stacking.socialsIntersectsViewport) {
            assert.ok(
                stacking.hitBelongsToOverlay && !stacking.hitIsSocialButton,
                "When Socials overlaps the viewport, the menu must paint and intercept above it. " +
                    JSON.stringify(stacking),
            );
        }

        const lockBeforeWheel = await page.evaluate(() => ({
            scrollY: window.scrollY,
            bodyPosition: getComputedStyle(document.body).position,
            bodyTop: document.body.style.top,
            bodyOverflow: getComputedStyle(document.body).overflow,
            htmlOverflow: getComputedStyle(document.documentElement).overflow,
        }));

        assert.equal(
            lockBeforeWheel.bodyPosition,
            "fixed",
            "Body must be fixed while the mobile menu is open. " + JSON.stringify(lockBeforeWheel),
        );
        assert.equal(
            lockBeforeWheel.htmlOverflow,
            "hidden",
            "The document element must not scroll while the mobile menu is open.",
        );

        // Rola sobre a área escura fora do painel, onde a página ficaria acessível sem bloqueio.
        await page.mouse.move(viewport.width - 3, Math.round(viewport.height * 0.65));
        await page.mouse.wheel(0, 650);
        await page.waitForTimeout(250);

        const lockAfterWheel = await page.evaluate(() => ({
            scrollY: window.scrollY,
            bodyPosition: getComputedStyle(document.body).position,
            bodyTop: document.body.style.top,
            bodyOverflow: getComputedStyle(document.body).overflow,
            htmlOverflow: getComputedStyle(document.documentElement).overflow,
        }));

        assert.equal(
            lockAfterWheel.bodyPosition,
            "fixed",
            "The page body was unlocked while the panel was still open.",
        );
        assert.equal(
            lockAfterWheel.bodyTop,
            lockBeforeWheel.bodyTop,
            "Wheel scrolling changed the preserved page position while the menu was open.",
        );
        assert.equal(
            lockAfterWheel.scrollY,
            lockBeforeWheel.scrollY,
            "Page scroll position changed while mobile menu was open. " +
                JSON.stringify({ before: lockBeforeWheel, after: lockAfterWheel }),
        );

        // Fechar por link também valida que o desbloqueio ocorre antes da navegação.
        await page.locator("[data-mobile-menu-link]").nth(2).click();
        await page.waitForSelector("[data-mobile-menu-overlay]", {
            state: "detached",
            timeout: 15000,
        });
        await page.waitForFunction(
            () => document.body.style.position !== "fixed" &&
                document.documentElement.style.overflow !== "hidden",
            null,
            { timeout: 10000 },
        );
        await page.waitForFunction(() => window.scrollY > 100, null, { timeout: 10000 });

        const afterNavigation = await page.evaluate(() => ({
            scrollY: window.scrollY,
            bodyPosition: document.body.style.position,
            htmlOverflow: document.documentElement.style.overflow,
        }));

        assert.ok(
            afterNavigation.scrollY > 100,
            "Selecting a menu link should still navigate after scroll lock is removed.",
        );
        assert.notEqual(
            afterNavigation.bodyPosition,
            "fixed",
            "Body positioning was not restored after closing the panel.",
        );

        console.log(JSON.stringify({
            mode,
            stacking,
            lockedScrollY: lockBeforeWheel.scrollY,
            scrollYAfterWheel: lockAfterWheel.scrollY,
            scrollYAfterNavigation: afterNavigation.scrollY,
            result: "passed",
        }));
    } finally {
        await context.close();
    }
}

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
    for (const mode of modes) {
        await testMenuOverlayAndScrollLock(browser, mode);
    }
} finally {
    await browser.close();
}

console.log("Mobile menu overlay and scroll-lock regression checks passed.");
