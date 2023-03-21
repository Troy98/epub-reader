const puppeteer = require('puppeteer');
const { localStorageData } = require('./test.functions.js');
jest.setTimeout(30000);

describe('Login as helper', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
  });

  test('account does not exist', async () => {
    await page.goto('http://localhost:3000/');
    await page.type('#username', 'jantje');
    await page.click('#inloggen');
    await page.waitForSelector('#error', { visible: true });
    const error = await page.$eval('#error', (el) => el.textContent);
    expect(error).toContain('Invalide gegevens');
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should be able to login', async () => {
    await page.goto('http://localhost:3000/');
    await page.type('#username', 'testuser');
    await page.click('#default-checkbox');
    await page.click('#inloggen');
    await page.waitForSelector('#library', { visible: true, timeout: 3000 });
    const localStorage = await localStorageData(page);
    expect(page.url()).toBe('http://localhost:3000/bibliotheek');
    expect(localStorage.isHelper).toBe("true");
  });
});