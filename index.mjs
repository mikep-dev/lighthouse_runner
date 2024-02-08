import { exec } from "child_process";
import { writeFileSync } from "fs";
import { startFlow } from "lighthouse";
import puppeteer, { KnownDevices } from "puppeteer";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
await page.emulate(KnownDevices["iPhone 11"]);
await page.goto("https://google.com");

const flow = await startFlow(page, {
  config: {
    extends: "lighthouse:default",
    throttling: {
      cpuSlowdownMultiplier: 8,
    },
  },
});
await flow.startTimespan();
await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
await flow.endTimespan();

await browser.close();
writeFileSync("report.html", await flow.generateReport());
exec("open report.html");
