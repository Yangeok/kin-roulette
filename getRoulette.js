const puppeteer = require('puppeteer')
const ProgressBar = require('progress')
const sec = require('./sec')

const width = 400
const height = 1200
const options = {
	headless: false,
	slowMo: true,
	args: [
		`--window-size=${width},${height}`,
		'--no-sandbox',
		'--disable-setuid-sandbox'
	]
}
const iPhone = puppeteer.devices['iPhone X']

const goToPost = async (page, link) => {
	await page.goto(link)
	await page.waitForSelector('.choiceButton', {
		timeout: 30000
	})
	await page.evaluate(() => {
		const $ = window.$
		$('#0').click()
		$('.choiceButton').click()
	})
	await page.keyboard.press('Enter')
}

const getLinks = async page => {
	return await page.evaluate(() => {
		const $ = window.$
		// const res = $('a.item_socialplugin--2Rewd')
		const res = $('.spi_sns_share')
			.toArray()
			.map((link, index) => {
				return {
					url: $(link)
						.attr('data-oninitialize')
						.split('url:')[1]
						.split(',title')[0]
						.replace(/\'/g, ''),
					// .attr('data-oninitialize')
					// .split(`'`)[1],
					index
				}
			})
		return res
	})
}

const accessChoice = async page => {
	await page.goto('https://m.kin.naver.com/mobile/choice/list?dirId=8')
	await page.waitFor('.link > em', {
		timeout: 30000
	})
	await page.addScriptTag({
		path: require.resolve('jquery')
	})
	await page.evaluate(() => {
		const $ = window.$
		for (let i = 1; i < 20; i++) {
			$('.link > em').click()
		}
	})
	await page.waitFor(10000)
}

const haveLogin = async page => {
	const env = process.env
	const naverId = env.ID
	const naverPw = env.PW

	await page.goto('https://nid.naver.com/nidlogin.login')
	await page.evaluate(
		(id, pw) => {
			document.querySelector('#id').value = id
			document.querySelector('#pw').value = pw
		},
		naverId,
		naverPw
	)
	await page.click('.btn_global')
	await page.waitForNavigation()

	const isExistCancelButton = await page.evaluate(() => location.href)
	if (isExistCancelButton !== 'https://m.naver.com/') {
		await page.click('.btn_cancel')
		await page.waitForNavigation()
	}
}

const browserOptions = async page => {
	await page.setViewport({
		width,
		height
	})
	await page.emulate(iPhone)
}

const init = async () => {
	const browser = await puppeteer.launch(options)
	const page = await browser.newPage()

	try {
		await browserOptions(page)
		await haveLogin(page)
		await accessChoice(page)
		for (const link of await getLinks(page)) {
			const bar = new ProgressBar(' [:bar] :percent :current/:total', {
				total: 200,
				width: 50
			})
			bar.tick(link.index)
			await page.waitFor(sec(500, 750))
			await goToPost(page, link.url)
		}
	} catch (err) {
		console.log(err)
	} finally {
		await browser.close()
	}
}

init()