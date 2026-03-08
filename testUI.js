import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    console.log("Navigating to app...");
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });

    // Login
    console.log("Logging in...");
    await page.type('input[type="email"]', 'admin@moksha.com');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log("Navigating to products...");
    await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle0' });

    // Try Delete
    console.log("Testing DELETE button...");
    try {
        const deleteBtn = await page.$('.btn-danger');
        if (deleteBtn) {
            // Automatically accept the confirm dialog
            page.on('dialog', async dialog => {
                console.log("Dialog message:", dialog.message());
                await dialog.accept();
            });
            await deleteBtn.click();
            await new Promise(r => setTimeout(r, 1000));
        } else {
            console.log("Delete button not found.");
        }
    } catch (e) { console.log("Delete failed", e.message); }

    // Try Download Sample
    console.log("Testing DOWNLOAD Sample button...");
    try {
        const buttons = await page.$$('button.btn-secondary');
        let downloadBtn;
        for (let btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Download Sample Excel')) {
                downloadBtn = btn;
                break;
            }
        }
        if (downloadBtn) {
            await downloadBtn.click();
            await new Promise(r => setTimeout(r, 1000));
        } else {
            console.log("Download button not found.");
        }
    } catch (e) { console.log("Download failed", e.message); }

    // Try Add Product
    console.log("Testing ADD PRODUCT button...");
    try {
        const buttons = await page.$$('button.btn-primary');
        let addBtn;
        for (let btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Add Product')) {
                addBtn = btn;
                break;
            }
        }
        if (addBtn) {
            await addBtn.click();
            await new Promise(r => setTimeout(r, 1000));
            console.log("Add Product clicked!");
        } else {
            console.log("Add Product button not found.");
        }
    } catch (e) { console.log("Add Product failed", e.message); }

    console.log("Done checking.");
    await browser.close();
})();
