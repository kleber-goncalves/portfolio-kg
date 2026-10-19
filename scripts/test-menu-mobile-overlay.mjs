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

async function expectLogo(page, { width, height, expectedSrc, label, expectFullLogo }) {
    await page.setViewportSize({ width, height });

    await page.waitForFunction(
        ({ expectedSrc, expectCompactLandscape }) => {
            const image = document.querySelector("[data-hero-mobile-logo]");
            const isCompactLandscape = window.matchMedia(
                "(orientation: landscape) and (max-height: 600px)",
            ).matches;

            return Boolean(
                image &&
                image.getAttribute("src") === expectedSrc &&
                (expectCompactLandscape === null || isCompactLandscape === expectCompactLandscape)
            );
        },
        {
            expectedSrc,
            expectCompactLandscape:
                label === "phone-landscape" ? true :
                label === "phone-portrait" ? false :
                null,
        },
        { timeout: 10000 },
    );

    if (label.startsWith("tablet")) {
        await page.waitForFunction(
            () => window.matchMedia("(hover: none) and (pointer: coarse)").matches &&
                window.innerWidth >= 768,
            null,
            { timeout: 10000 },
        );
    }

    const details = await page.locator("[data-hero-mobile-logo]").evaluate((image) => {
        const rect = image.getBoundingClientRect();
        return {
            src: image.getAttribute("src"),
            complete: image.complete,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            width: rect.width,
            height: rect.height,
        };
    });

    assert.equal(
        details.src,
        expectedSrc,
        label + " must use " + expectedSrc + ". " + JSON.stringify(details),
    );

    if (expectFullLogo) {
        assert.ok(
            details.complete && details.naturalWidth > 0,
            label + " must load the horizontal full logo.",
        );
        assert.ok(
            Math.abs(details.width / details.height - 1024 / 300) < 0.04,
            label + " must preserve the full logo's aspect ratio. " + JSON.stringify(details),
        );
    } else {
        assert.ok(
            Math.abs(details.width - details.height) < 1,
            label + " should keep the existing square compact logo container. " + JSON.stringify(details),
        );
    }

    return details;
}

async function testHeroMobileLogoOrientation(page, mode) {
    await page.waitForFunction(
        () => document.querySelector("[data-hero-mobile-logo]")?.getAttribute("src") === "/logo.svg",
        null,
        { timeout: 10000 },
    );

    const phonePortrait = await expectLogo(page, {
        width: 390,
        height: 1000,
        expectedSrc: "/logo.svg",
        label: "phone-portrait",
        expectFullLogo: false,
    });

    const phoneLandscape = await expectLogo(page, {
        width: 844,
        height: 390,
        expectedSrc: "/logo-completa-bra.svg",
        label: "phone-landscape",
        expectFullLogo: true,
    });

    const tabletPortrait = await expectLogo(page, {
        width: 820,
        height: 1180,
        expectedSrc: "/logo-completa-bra.svg",
        label: "tablet-portrait",
        expectFullLogo: true,
    });

    const tabletLandscape = await expectLogo(page, {
        width: 1180,
        height: 820,
        expectedSrc: "/logo-completa-bra.svg",
        label: "tablet-landscape",
        expectFullLogo: true,
    });

    // Return to the original mobile portrait viewport so the menu/scroll-lock checks
    // below continue testing the same phone-sized layout as before.
    await expectLogo(page, {
        width: 390,
        height: 1000,
        expectedSrc: "/logo.svg",
        label: "phone-portrait-after-resize",
        expectFullLogo: false,
    });

    console.log(JSON.stringify({
        mode,
        phonePortrait: phonePortrait.src,
        phoneLandscape: phoneLandscape.src,
        tabletPortrait: tabletPortrait.src,
        tabletLandscape: tabletLandscape.src,
        result: "passed",
    }));
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

        await testHeroMobileLogoOrientation(page, mode);

        await page.locator('button[aria-label="Abrir menu"]').click();
        await page.waitForSelector("[data-mobile-menu-overlay]", {
            state: "visible",
            timeout: 10000,
        });
        await page.waitForSelector('[data-mobile-menu] button[aria-label="Fechar menu"]', {
            state: "visible",
            timeout: 10000,
        });

        const soundEntries = page.locator("[data-mobile-menu-entry]");
        assert.equal(
            await soundEntries.count(),
            2,
            "Sound toggle and volume slider must have independent entry-animation wrappers.",
        );

        await page.waitForFunction(() => {
            const entries = [...document.querySelectorAll("[data-mobile-menu-entry]")];
            return entries.length === 2 && entries.every((entry) => {
                const style = getComputedStyle(entry);
                const translateX = style.transform === "none"
                    ? 0
                    : new DOMMatrixReadOnly(style.transform).m41;
                return Number(style.opacity) < 0.99 && translateX < -1;
            });
        }, null, { timeout: 5000 });

        await page.waitForFunction(() => {
            const entries = [...document.querySelectorAll("[data-mobile-menu-entry]")];
            return entries.length === 2 && entries.every((entry) => {
                const style = getComputedStyle(entry);
                const translateX = style.transform === "none"
                    ? 0
                    : new DOMMatrixReadOnly(style.transform).m41;
                return Number(style.opacity) >= 0.99 && Math.abs(translateX) < 0.5;
            });
        }, null, { timeout: 10000 });

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
