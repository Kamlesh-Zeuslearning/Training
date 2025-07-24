import { test, expect } from "@playwright/test";

test.skip("basic page test", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sheet/);
});

test.skip("upload file", async ({ page }) => {
    await page.goto("/");
    await page
        .locator("//label[contains(text(),'📂 Upload')]")
        .setInputFiles("C:\\Users\\kamlesh.suthar\\Downloads\\data.json");
    // await page.locator("//label[contains(text(),'📂 Upload')]").click()
    await page.pause();
});

test("Enter text", async ({ page }) => {
    await page.goto("/");
    const locator = page.locator("//div[@id='grid']//canvas");
    await locator.click({ position: { x: 23, y: 35 } });
    // await page.waitForTimeout(1000);
    const range = await page.evaluate(() => {
        return window.getSelectedRange();
    });
    
    expect(range.startRow).toBe(range.endRow);
    expect(range.startCol).toBe(range.endCol);

    //adding text
    await locator.pressSequentially("kamlesh", { delay: 100 });
    await locator.press("Enter");
    const cellValue = await page.evaluate(
        ({ startRow, startCol }) => {
            return window.getCellValue(startRow, startCol);
        },
        { startRow: range.startRow, startCol: range.startCol }
    );

    expect(cellValue).toBe("kamlesh");
    // await page.waitForTimeout(1000);

    //undo
    await locator.press("Control+z");
    await page.waitForTimeout(1000);

    //redo
    await locator.press("Control+y");
    await page.waitForTimeout(1000);

    //selecting cells
    await page.mouse.move(400, 250);
    await page.mouse.down();
    await page.waitForTimeout(1000);
    await page.mouse.move(500, 450);
    await page.waitForTimeout(1000);
    await page.mouse.up();

    //scroll
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1000);

    //selecting column
    await page.mouse.move(200, 80);
    await page.mouse.down();
    await page.mouse.move(900, 80);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // selecting row
    await page.mouse.move(12, 89);
    await page.mouse.down();
    await page.mouse.move(12, 200);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    //scrolling
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(1000);

    //column resizing
    await page.mouse.move(150, 55);
    await page.mouse.down();
    await page.mouse.move(200, 59);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    //row resizing
    await page.mouse.move(12, 110);
    await page.mouse.down();
    await page.mouse.move(12, 170);
    await page.mouse.up();
    await page.waitForTimeout(1000);
});
