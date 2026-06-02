const { chromium } =
  require("playwright");

(async () => {
  const browser =
    await chromium.launch({
      headless: false
    });

  const context =
    await browser.newContext();

  const page =
    await context.newPage();

  await page.goto(
    "https://open.spotify.com/login"
  );

  console.log(
    "LOGIN MANUAL DULU"
  );

  // tunggu kamu login
  await page.waitForTimeout(
    120000
  );

  await context.storageState({
    path:
      "spotify-login.json"
  });

  console.log(
    "✅ spotify-login.json saved"
  );

  await browser.close();
})();
