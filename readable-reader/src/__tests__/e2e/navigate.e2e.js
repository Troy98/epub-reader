const puppeteer = require('puppeteer');
jest.setTimeout(30000);


describe('navigate in library', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.type('#username', 'testusertwobooks');
    await page.click('#default-checkbox');
    await page.click('#inloggen');
    await page.waitForSelector('#library', { visible: true, timeout: 3000 });
  });

  afterAll(() => {
    browser.close();
  });

  test('should be able to navigate in library', async () => {
    await page.goto('http://localhost:3000/bibliotheek');
    await page.waitForSelector('.swiper-button-next', { visible: true, timeout: 3000 });
    await page.click('.swiper-button-next');
    const children = await page.$$('.swiper-slide > div');
    let title = '';
    for (let i = 0; i < children.length; i++) {
      title = await children[i].$eval('h1', (el) => el.textContent);
      title = title.replaceAll('­', '');
    }

    expect(title).toContain("testbook");
  });
});