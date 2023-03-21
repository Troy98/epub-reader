const puppeteer = require('puppeteer');
const { localStorageData } = require('./test.functions.js');

jest.setTimeout(30000);

describe('Register as helper', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
  });

  test('should be able to register as helper', async () => {
    await page.goto('http://localhost:3000/registreren');
    const random = (Math.random() + 1).toString(36).substring(7);
    await page.type('#username', random);
    await page.click('#default-checkbox');
    await page.click('#registreren');
    await page.waitForSelector('#library');
    const localStorage = await localStorageData(page);
    expect(page.url()).toBe('http://localhost:3000/bibliotheek');
    expect(localStorage.isHelper).toBe("true");
  });
});