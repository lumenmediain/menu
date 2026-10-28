import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
try {
  await page.goto(process.env.TEST_URL || "http://localhost:4400");
  await page.waitForSelector(".single-leaf");
  await page
    .getByRole("button", { name: "Turn to next page", exact: true })
    .tap();
  await page.waitForFunction(() => !document.querySelector(".turn-layer"));
  const photo = page.locator(".single-leaf .category-photo");
  await photo.scrollIntoViewIfNeeded();
  const rect = await photo.boundingBox();
  const y = rect.y + 30;
  const swipe = async (start, end, cancel = false) => {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: start, y }],
    });
    for (let n = 1; n <= 12; n++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: start + ((end - start) * n) / 12, y: y + 2 }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: cancel ? "touchCancel" : "touchEnd",
      touchPoints: [],
    });
    await page.waitForTimeout(50);
    await page.waitForFunction(() => !document.querySelector(".turn-layer"));
  };
  await swipe(330, 290);
  assert.match(await page.locator(".single-leaf h2").innerText(), /coffee/i);
  await swipe(330, 120, true);
  assert.match(await page.locator(".single-leaf h2").innerText(), /coffee/i);
  await swipe(330, 35);
  assert.equal(
    await page.locator(".book-stage").getAttribute("data-current-page"),
    "2",
  );
  // Backward swipe from the receiving sheet's free image area.
  const nextPhoto = page.locator(".single-leaf .category-photo");
  await nextPhoto.scrollIntoViewIfNeeded();
  const backRect = await nextPhoto.boundingBox();
  const backY = backRect.y + 35;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 60, y: backY }],
  });
  for (let n = 1; n <= 12; n++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 60 + (260 * n) / 12, y: backY }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForTimeout(50);
  await page.waitForFunction(() => !document.querySelector(".turn-layer"));
  assert.match(await page.locator(".single-leaf h2").innerText(), /coffee/i);
  console.log(
    "4 native touch checks passed: incomplete, cancellation, forward and backward.",
  );
} finally {
  await browser.close();
}
