const puppeteer = require('puppeteer');

const width = 783,
  height = 700;
const options = {
  headless: false,
  slowMo: true,
  args: [
    `--window-size=${width},${height}`,
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
};
const iPhone = puppeteer.devices['iPhone 6'];
const host = 'https://m.kin.naver.com/mobile/choice';

const generateURL = () => {
  return `${host}/list?dirId=8`;
};

const browserOptions = async page => {
  await page.setViewport({ width, height });
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
  const naverId = 'wooky92';
  const naverPw = '60716071w!';

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
  await page.click('.btn_cancel');
  await page.waitForNavigation();
};

const accessChoice = async page => {
  await page.goto(generateURL());
  await page.waitFor('.link > em', { timeout: 30000 });
  await page.addScriptTag({
    path: require.resolve('jquery')
  });
  await page.evaluate(() => {
    const $ = window.$;
    for (let i = 1; i < 20; i++) {
      $('.link > em').click();
    }
  });
  await page.waitFor(10000);
};

const getLinks = async page => {
  return await page.evaluate(() => {
    const $ = window.$;
    const res = $('a.item_socialplugin--2Rewd')
      .toArray()
      .map(
        link =>
          $(link)
            .attr('data-oninitialize')
            .split(`'`)[1]
      );
    return res;
  });
};

const goToPost = async (page, link) => {
  await page.goto(link);
  await page.waitForSelector('.choiceButton', { timeout: 30000 });
  await page.evaluate(() => {
    const $ = window.$;
    $('#0').click();
    $('.choiceButton').click();
  });
};

const init = async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await browserOptions(page);
  await haveLogin(page);
  await accessChoice(page);
  for (const link of await getLinks(page)) {
    console.log(link);
    await goToPost(page, link);
  }
};

init();
