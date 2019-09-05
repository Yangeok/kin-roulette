const puppeteer = require('puppeteer');

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

const init = async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await browserOptions(page);
  await haveLogin(page);
  await useRoulette(page);
};

const useRoulette = async page => {
  await page.goto('https://m.kin.naver.com/mobile/roulette/home.nhn');
  let isNull = false;
  // console.log(isNull);

  const count = await page.evaluate(() => {
    const $ = window.$;
    return $('.num._rouletteTicketCount').text();
  });

  if (count == 0) {
    isNull = true;
  }

  // console.log(isNull);
  if (!isNull) {
    await page.evaluate(() => {
      const $ = window.$;
      $('.button_start').click();
      location.reload();
    });
    await useRoulette(page);
  }
};

const browserOptions = async page => {
  await page.setViewport({
    width,
    height
  });
  await page.emulate(iPhone);
  // await page.setRequestInterception(true);
  // await page.on('request', req => {
  //   if (
  //     req.resourceType() == 'stylesheet' ||
  //     req.resourceType() == 'font' ||
  //     req.resourceType() == 'image'
  //   ) {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });
};

const haveLogin = async page => {
  const env = process.env
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

  const isExistCancelButton = await page.evaluate(() => location.href)
  if (isExistCancelButton) {
    await page.click('.btn_cancel');
    await page.waitForNavigation();
  }
};

init();