const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

const width = 400,
  height = 838;
const options = {
  headless: false,
  slowMo: true,
  args: [
    `--window-size=${width},${height}`,
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
};
const iPhone = puppeteer.devices['iPhone X'];

const useRoulette = async page => {
  await page.goto('https://m.kin.naver.com/mobile/roulette/home.nhn');
  let isNull = false;

  const count = await page.evaluate(() => {
    const $ = window.$;
    return $('.num._rouletteTicketCount').text();
  });
  const bar = new ProgressBar(` [:bar] :percent ${count}/:total`, {
    total: 66,
    width: 50
  });
  bar.tick(count);

  if (count == 0) {
    isNull = true;
  }

  if (!isNull) {
    await page.evaluate(() => {
      const $ = window.$;
      $('.button_start').click();
      location.reload();
    });
    await useRoulette(page);
  }
};

const haveLogin = async page => {
  const env = process.env;
  const naverId = env.ID;
  const naverPw = env.PW;

  await page.goto('https://nid.naver.com/nidlogin.login');
  await page.evaluate(
    (id, pw) => {
      document.querySelector('#id').value = id;
      document.querySelector('#pw').value = pw;
    },
    naverId,
    naverPw
  );
  await page.click('.btn_global');
  await page.waitForNavigation();

  const isExistCancelButton = await page.evaluate(() => location.href);
  if (isExistCancelButton !== 'https://m.naver.com/') {
    await page.click('.btn_cancel');
    await page.waitForNavigation();
  }
};

const browserOptions = async page => {
  await page.setViewport({
    width,
    height
  });
  await page.emulate(iPhone);
};

const init = async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await browserOptions(page);
  await haveLogin(page);
  try {
    await useRoulette(page);
  } catch (err) {
    console.log(err)
  } finally {
    // await browser.close()
    await page.goto('https://m.me.naver.com/noti.nhn')
  }
};

init();