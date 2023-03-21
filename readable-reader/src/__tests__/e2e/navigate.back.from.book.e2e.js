const puppeteer = require('puppeteer');
jest.setTimeout(30000);

describe('Navigate back from book', () => {

    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(() => {
        browser.close();
    });


    test('should be able to navigate back to library', async () => {
        await page.goto('http://localhost:3000/');
        await page.type('#username', 'testuser');
        await page.click('#inloggen');
        await page.waitForSelector('#library', { visible: true, timeout: 3000 });

        expect(page.url()).toBe('http://localhost:3000/bibliotheek');

        await page.waitForSelector('#book-container', { visible: true, timeout: 3000 });
        const data = await page.evaluate(() => {
            const bookContainer = document.querySelector('#book-container');
            return bookContainer.dataset.id;
        })

        await page.waitForSelector('#book-link', { visible: true, timeout: 3000 });
        await page.click('#book-link');
        await page.waitForSelector('#reader-back-button', { visible: true, timeout: 3000 });
        await page.waitForSelector('#reader-confirmed', { visible: true, timeout: 3000 });

        const url = new URL(page.url());
        const bookId = url.pathname.split('/')[2];

        expect(data).toBe(bookId);
        expect(page.url()).toBe(`http://localhost:3000/readerhtml/${data}`);

        await page.waitForSelector('#loader', {hidden: true, timeout: 3000} );
        await page.click('#reader-back-button > svg');
        await page.waitForSelector('#library', { visible: true, timeout: 3000 });

        expect(page.url()).toBe('http://localhost:3000/bibliotheek');
    });
});