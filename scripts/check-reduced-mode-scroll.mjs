import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.COVERAGE_URL || "http://127.0.0.1:4173/";

const scenarios = [
    { name: "Desktop", width: 1365, height: 900, isMobile: false, hasTouch: false },
    { name: "Celular", width: 390, height: 844, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
    for (const scenario of scenarios) {
        const context = await browser.newContext({
            viewport: { width: scenario.width, height: scenario.height },
            deviceScaleFactor: 1,
            isMobile: scenario.isMobile,
            hasTouch: scenario.hasTouch,
        });

        const page = await context.newPage();

        // Define a preferência antes que o bundle da aplicação seja executado.
        await page.addInitScript(() => {
            try {
                window.localStorage.setItem("experienceMode", "reduced");
            } catch {
                // O script também pode ser executado em about:blank, sem origem.
            }
        });

        try {
            console.log("Verificando rolagem no modo reduzido: " + scenario.name);

            await page.goto(baseUrl, {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });

            assert.equal(
                await page.evaluate(() => localStorage.getItem("experienceMode")),
                "reduced",
                "O modo reduzido não foi definido antes da inicialização da aplicação.",
            );

            // Confirma que o efeito do Preloader executou e aplicou seu bloqueio.
            await page.waitForFunction(
                () => document.body?.style.overflow === "hidden",
                null,
                { timeout: 15000 },
            );

            // A página só deve liberar a rolagem depois que o Preloader desaparecer.
            await page.waitForFunction(
                () =>
                    document.body?.style.overflow !== "hidden" &&
                    !document.querySelector('[role="status"]'),
                null,
                { timeout: 20000 },
            );

            const initial = await page.evaluate(() => ({
                bodyOverflow: document.body.style.overflow,
                viewportHeight: window.innerHeight,
                documentHeight: Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight,
                ),
                scrollY: window.scrollY,
            }));

            assert.notEqual(
                initial.bodyOverflow,
                "hidden",
                "O Preloader terminou, mas document.body continua com overflow:hidden.",
            );
            assert.ok(
                initial.documentHeight > initial.viewportHeight + 100,
                "A página não tem altura rolável suficiente para validar o teste.",
            );

            // Usa entrada de roda do próprio navegador; não força window.scrollTo().
            for (let attempt = 0; attempt < 4; attempt += 1) {
                await page.mouse.move(
                    Math.floor(scenario.width / 2),
                    Math.floor(scenario.height / 2),
                );
                await page.mouse.wheel(0, 650);
                await page.waitForTimeout(300);

                const scrollY = await page.evaluate(() => window.scrollY);
                if (scrollY > 0) break;
            }

            const finalScrollY = await page.evaluate(() => window.scrollY);
            assert.ok(
                finalScrollY > 0,
                "A rolagem do navegador não avançou no modo reduzido depois que o Preloader terminou.",
            );

            console.log(
                "PASSOU — " + scenario.name +
                ": overflow=" + JSON.stringify(initial.bodyOverflow) +
                ", scrollY=" + finalScrollY +
                ", altura=" + initial.documentHeight + "px.",
            );
        } finally {
            await context.close();
        }
    }
} finally {
    await browser.close();
}

console.log("Todos os testes de rolagem do modo reduzido passaram.");
