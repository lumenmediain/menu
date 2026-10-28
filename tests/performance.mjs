import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
const cpuRate = Number(process.env.TEST_CPU_RATE || 4);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: 200000,
  uploadThroughput: 90000,
});
await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
await page.addInitScript(() => {
  window.__vitals = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    window.__vitals.lcp = entries.at(-1).startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
});
try {
  await page.goto(process.env.TEST_URL || "http://localhost:4400");
  await page.waitForTimeout(3000);
  const metrics = await page.evaluate(() => ({
    ...window.__vitals,
    resources: performance.getEntriesByType("resource").map((r) => ({
      name: r.name.split("/").at(-1),
      bytes: r.transferSize,
      kind: r.initiatorType,
    })),
    domNodes: document.querySelectorAll("*").length,
  }));
  metrics.conditions = {
    cpuSlowdown: cpuRate,
    latencyMs: 150,
    downloadBytesPerSecond: 200000,
    viewport: "390 × 844",
    localProductionServer: true,
  };
  // Measure a complete turn on a simulated mid-range phone. Local measurements
  // are diagnostic, not a guarantee of field performance on customer devices.
  await page.evaluate(() => {
    window.__frameTimes = [];
    let previous = performance.now();
    const sample = (now) => {
      window.__frameTimes.push(now - previous);
      previous = now;
      if (window.__frameTimes.length < 90) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    document.querySelector(".corner-next").click();
  });
  await page.waitForTimeout(2200);
  metrics.frameTiming = await page.evaluate(() => {
    const times = window.__frameTimes.slice(1);
    const sorted = [...times].sort((a, b) => a - b);
    return {
      meanMs: times.reduce((a, b) => a + b, 0) / times.length,
      medianMs: sorted[Math.floor(sorted.length / 2)],
      p95Ms: sorted[Math.floor(sorted.length * 0.95)],
      maxMs: Math.max(...times),
      over33ms: times.filter((n) => n > 33.4).length,
      samples: times.length,
    };
  });
  await fs.writeFile(
    `.shots/performance${cpuRate === 1 ? "-native" : ""}.json`,
    JSON.stringify(metrics, null, 2),
  );
  console.log(
    JSON.stringify({
      lcp: metrics.lcp,
      cls: metrics.cls,
      frameTiming: metrics.frameTiming,
    }),
  );
} finally {
  await browser.close();
}
