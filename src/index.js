const setup = require('./starter-kit/setup');

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();
  try {
    const result = await exports.run(browser);
    callback(null, result);
  } catch (e) {
    callback(e);
  }
};

exports.run = async (browser) => {
  const page = await browser.newPage();

  // login

  console.log('Logging in to Google');
  await page.goto('https://accounts.google.com/', {
    waitUntil: ['domcontentloaded', 'networkidle0'],
  });

  console.log('Typing in username');
  await (await page.$('input')).type(process.env.G_USERNAME);
  await page.waitFor(500);
  await page.keyboard.press('Enter');

  console.log('Wait 3 seconds');
  await page.waitFor(3000);

  console.log('Typing in password');
  await (await page.$('input')).type(process.env.G_PASSWORD);
  await page.waitFor(500);
  await page.keyboard.press('Enter');

  console.log('Wait 3 seconds');
  await page.waitFor(3000);

  const title = await page.evaluate((el) => el.innerHTML, await page.$('h1'));
  if (title.trim() == 'Verify that it\'s you') {
    console.log('Login blocked');

    // click "Confirm your recovery email"
    await page.$eval('form', (form) => form.submit());

    console.log('Wait 3 seconds');
    await page.waitFor(3000);

    await (await page.$('input')).type(process.env.RECOVERY_EMAIL);
    await page.keyboard.press('Enter');

    console.log('Wait 3 seconds');
    await page.waitFor(3000);
  }

  console.log('Reaching dashboard');
  await page.goto(process.env.URL);

  console.log('Wait 3 seconds');
  await page.waitFor(3000);

  console.log('Wait until page is rendered');
  await page.waitForSelector('.header-button-icon.refreshIcon');

  console.log('Clicking the refresh button');
  await page.evaluate(() => {
    angular
      .element('.header-button')
      .scope()
      .appHeaderCtrl.refreshReport();
  });

  console.log('Wait for 3 seconds');
  await page.waitFor(3000);

  console.log('Dashboard refreshed');

  await page.close();
  return 'done';
};
