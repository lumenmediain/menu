import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_URL || "http://localhost:4400";
await fs.mkdir(".shots", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const report = { consoleErrors: [], checks: [], accessibility: [] };
page.on("pageerror", (e) => report.consoleErrors.push(e.message));
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
};
const next = () =>
  page.getByRole("button", { name: "Turn to next page", exact: true });
const prev = () =>
  page.getByRole("button", { name: "Turn to previous page", exact: true });
const settled = () =>
  page.waitForFunction(() => !document.querySelector(".turn-layer"));
const current = () =>
  page.locator(".book-stage").getAttribute("data-current-page").then(Number);
async function fit(label) {
  const result = await page.evaluate(() => {
    const b = document.querySelector(".book-shell").getBoundingClientRect();
    return {
      overflow:
        document.documentElement.scrollWidth > innerWidth ||
        document.documentElement.scrollHeight > innerHeight + 1,
      inside:
        b.left >= 0 &&
        b.right <= innerWidth &&
        b.top >= 0 &&
        b.bottom <= innerHeight - 5,
    };
  });
  check(
    `${label}: book fits viewport without document scrolling`,
    !result.overflow && result.inside,
  );
}
try {
  await page.goto(base);
  await page.locator(".right-leaf .menu-item").first().waitFor();
  await page.waitForTimeout(200);
  check(
    "website chrome removed from DOM",
    (await page
      .locator(
        ".site-header,.menu-introduction,.chapter-nav,.book-controls,.page-position,.reading-tools,.site-footer,.side-note,nav",
      )
      .count()) === 0,
  );
  check(
    "all customer buttons belong to the book",
    (await page
      .locator("main > button, main > header, main > footer")
      .count()) === 0,
  );
  check(
    "two facing desktop leaves",
    (await page.locator(".leaf-rest").count()) === 2,
  );
  await fit("Desktop");
  await page.screenshot({ path: ".shots/desktop-cover.png" });
  await next().click();
  await page.waitForSelector(".paper-facet");
  check(
    "soft sheet uses different tangents",
    (await page
      .locator(".paper-facet")
      .evaluateAll((es) => new Set(es.map((e) => e.style.transform)).size)) >
      20,
  );
  await settled();
  check("corner tap advances spread", (await current()) === 2);
  await page.screenshot({ path: ".shots/desktop-inner.png" });
  await prev().click();
  await settled();
  check("backward corner returns to cover", (await current()) === 0);
  await next().click();
  await prev().click();
  await page.waitForTimeout(1900);
  await settled();
  check("rapid reversal safely returns to cover", (await current()) === 0);
  await page.keyboard.press("ArrowRight");
  await settled();
  check("keyboard forward", (await current()) === 2);
  await page.keyboard.press("ArrowLeft");
  await settled();
  check("keyboard backward", (await current()) === 0);
  const dish = page.locator(".right-leaf .menu-item").first();
  await dish.click();
  await page.locator("dialog[open]").waitFor();
  await page.waitForTimeout(300);
  check(
    "preview displays dish and price",
    (await page.locator("#preview-title").innerText()).includes("flat white"),
  );
  check("preview retains page position", (await current()) === 0);
  await page.keyboard.press("Tab");
  check(
    "preview traps keyboard focus",
    await page
      .locator("dialog")
      .evaluate((e) => e.contains(document.activeElement)),
  );
  await page.screenshot({ path: ".shots/desktop-preview.png" });
  await page.keyboard.press("Escape");
  check(
    "closing preview restores item focus",
    await dish.evaluate((e) => e === document.activeElement),
  );
  check(
    "ordering absent",
    (await page
      .getByRole("button", { name: /add to cart|buy now|checkout/i })
      .count()) === 0,
  );
  const contact = page.locator(".right-leaf .printed-contact");
  await contact.click();
  await page.locator(".contact-dialog[open]").waitFor();
  check("contact accessible without leaving spread", (await current()) === 0);
  await page.keyboard.press("ArrowRight");
  check("contact dialog blocks book shortcuts", (await current()) === 0);
  await page.keyboard.press("Escape");
  check("contact restores focus", await contact.evaluate((e) => e === document.activeElement));
  const desktopAxe = await new AxeBuilder({ page }).analyze();
  report.accessibility.push({
    viewport: "desktop",
    violations: desktopAxe.violations,
  });
  // Hold a real corner drag halfway through its curve for visual inspection.
  const deskRect = await page.locator(".book-stage").boundingBox();
  await page.mouse.move(
    deskRect.x + deskRect.width - 8,
    deskRect.y + deskRect.height - 12,
  );
  await page.mouse.down();
  await page.mouse.move(
    deskRect.x + deskRect.width - deskRect.width * 0.24,
    deskRect.y + deskRect.height - 60,
    { steps: 12 },
  );
  check(
    "corner drag creates a curved sheet",
    (await page.locator(".turn-layer").count()) === 1,
  );
  await page.screenshot({ path: ".shots/desktop-turn.png" });
  await page.mouse.move(
    deskRect.x + deskRect.width - 12,
    deskRect.y + deskRect.height - 14,
    { steps: 10 },
  );
  await page.mouse.up();
  await settled();
  check("dragging the corner back cancels turn", (await current()) === 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForSelector(".single-leaf");
  await page.waitForTimeout(100);
  await fit("Phone");
  check(
    "single full-size phone leaf",
    (await page.locator(".leaf-rest").count()) === 1,
  );
  await page.screenshot({ path: ".shots/mobile-cover.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const total = Number(
    await page.locator(".book-stage").getAttribute("data-page-count"),
  );
  const seen = new Set();
  for (let n = 1; n < total; n++) {
    await next().click();
    await page.waitForFunction(
      (index) =>
        Number(document.querySelector(".book-stage").dataset.currentPage) ===
        index,
      n,
    );
    check(
      `leaf ${n + 1}: reduced motion is immediate`,
      (await page.locator(".turn-layer").count()) === 0,
    );
    const cat = await page
      .locator(".single-leaf .printed-page")
      .getAttribute("data-category-id");
    const overflow = await page
      .locator(".single-leaf .page-content")
      .evaluateAll((es) => es.some((e) => e.scrollHeight > e.clientHeight + 2));
    check(`leaf ${n + 1}: menu content fits its paper`, !overflow);
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      await page.screenshot({ path: `.shots/mobile-${cat}.png` });
    }
  }
  check("all five food categories retained", seen.size === 5);
  check(
    "closing page retains hours and address",
    await page.locator(".single-leaf .info-details").isVisible(),
  );
  await page.screenshot({ path: ".shots/mobile-information.png" });
  const mobileAxe = await new AxeBuilder({ page }).analyze();
  report.accessibility.push({
    viewport: "mobile",
    violations: mobileAxe.violations,
  });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForTimeout(150);
  await fit("Small phone");
  // Remaining readable content can scroll inside the sheet on very short displays.
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(150);
  await fit("Landscape phone");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  for (let spread = 0; spread < 20; spread++) {
    const overflow = await page.locator(".leaf-rest .page-content").evaluateAll(
      (elements) => elements.some((element) => element.scrollHeight > element.clientHeight + 2),
    );
    check(`desktop spread ${spread + 1}: menu copy fits its paper`, !overflow);
    if (await page.locator(".corner-next").isDisabled()) break;
    await next().click();
  }
  await page.goto(`${base}/studio`);
  check(
    "Studio stays on a separate administrative route",
    (await page.locator("main").innerText()).includes("Your menu management studio is not connected yet"),
  );
  await page.goto(`${base}/missing-leaf`);
  check(
    "404 preserved",
    (await page.locator("h1").innerText()).includes("slipped out"),
  );
  check("zero browser exceptions", report.consoleErrors.length === 0);
  check(
    "zero serious accessibility violations",
    report.accessibility.every(
      (r) =>
        !r.violations.some((v) => ["serious", "critical"].includes(v.impact)),
    ),
  );
} finally {
  await fs.writeFile(".shots/report.json", JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(`${report.checks.length} book-only browser checks passed.`);
