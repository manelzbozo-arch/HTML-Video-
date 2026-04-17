const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    recordVideo: {
      dir: path.join(__dirname, "video-output"),
      size: { width: 1080, height: 1080 },
    },
  });

  const page = await context.newPage();

  const htmlPath = "file://" + path.resolve(__dirname, "splits.html");
  await page.goto(htmlPath);

  // Wait for initial render
  await page.waitForTimeout(500);

  // Let animation play out fully (stagger 7×140ms + 900ms transition + buffer)
  await page.waitForTimeout(3500);

  // Hold on final frame
  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  console.log("Video saved to ./video-output/");
})();
