module.exports = async (browser) => {
    const mode = process.env.EXPERIENCE_MODE;
    const url = process.env.PREVIEW_URL;

    if (mode !== "full" && mode !== "reduced") {
        throw new Error(
            `EXPERIENCE_MODE must be "full" or "reduced"; received: ${String(mode)}`,
        );
    }

    if (!url) {
        throw new Error("PREVIEW_URL must be set before preparing the Lighthouse browser.");
    }

    const page = await browser.newPage();

    try {
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 90000,
        });

        await page.evaluate((selectedMode) => {
            localStorage.setItem("experienceMode", selectedMode);
        }, mode);

        await page.reload({
            waitUntil: "domcontentloaded",
            timeout: 90000,
        });

        const storedMode = await page.evaluate(() => {
            return localStorage.getItem("experienceMode");
        });

        if (storedMode !== mode) {
            throw new Error(
                `Failed to persist experience mode. Expected "${mode}", received "${String(storedMode)}".`,
            );
        }

        console.log(
            `[LHCI] Verified experienceMode="${mode}" for ${page.url()}`,
        );
    } finally {
        await page.close();
    }
};
