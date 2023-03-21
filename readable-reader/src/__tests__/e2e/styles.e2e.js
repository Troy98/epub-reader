const puppeteer = require('puppeteer');
jest.setTimeout(30000);

describe('Change styling of font size, font family and line height', () => {

    let browser;
    let page;

    /**
     * Logs in and navigates to the reader page
     */
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    
        await page.goto('http://localhost:3000/');
        await page.type('#username', 'testuser');
        await page.click('#default-checkbox');
        await page.click('#inloggen');
        await page.waitForSelector('#library', { visible: true, timeout: 3000 });
        expect(page.url()).toBe('http://localhost:3000/bibliotheek');
        await page.waitForSelector('#loader', {hidden: true, timeout: 3000} );
        await page.waitForSelector('#bookTitle', { visible: true, timeout: 3000 });
        await page.click('#bookTitle');
        await page.waitForSelector('#reader123', { visible: true, timeout: 3000 });
    
    });

    /**
     * From the reader page, attempt to navigate to the layout container by clicking the text-config-button
     */
    test('Should be able to navigate to text layout container', async () => {

        await page.waitForSelector('#loader', {hidden: true, timeout: 10000} );
        await page.waitForSelector('.text-config-button', { visible: true, timeout: 3000 });
        await page.click('.text-config-button');
        await page.waitForSelector('#layoutContainer', { visible: true, timeout: 3000 });

    })

    /**
     * From the lay-out container, check whether you can change the slider of the font size and and if it changes the CSS properly.
     * Fails if 'Should be able to navigate to text layout container' fails.
     */
    test('Should be able to change font size', async () => {

        const fontSizeOutput = await page.$("#fontSizeOutput");
        const sliders = await page.$$('input[type=range]');
        const firstSlider = sliders[0];


        const valueBefore = await page.evaluate(firstSlider => firstSlider.value, firstSlider);

        await firstSlider.focus();
        await firstSlider.press('ArrowRight');

        const value = await page.evaluate(firstSlider => firstSlider.value, firstSlider);
        const output = await page.evaluate(el => el.innerHTML, fontSizeOutput);

        await page.waitForTimeout(100);

        const fontSize = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).fontSize;
        });

        // Expect the font size to be 1 bigger than the value before unless it is the max value of 400
        if (valueBefore === '400') {
            expect(value).toBe(valueBefore);
            expect(output).toBe(valueBefore);
            expect(fontSize).toBe('400px');
        } else{
            expect(value).toBe((parseInt(valueBefore) + 1).toString());
            expect(output).toBe((parseInt(valueBefore) + 1).toString());
            expect(fontSize).toBe((parseInt(valueBefore) + 1) + 'px');
        }

    });

    /**
     * From the lay-out container, check whether you can change the slider of the line height and and if it changes the CSS properly.
     * Fails if 'Should be able to navigate to text layout container' fails.
     */
    test('Should be able to change line height', async () => {

        const lineHeightOutput = await page.$("#lineHeightOutput");
        const sliders = await page.$$('input[type=range]');
        const secondSlider = sliders[1];

        const valueBefore = await page.evaluate(firstSlider => firstSlider.value, secondSlider);

        const lineHeightBefore = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).lineHeight;
        });

        await secondSlider.focus();
        await secondSlider.press('ArrowRight');

        const value = await page.evaluate(secondSlider => secondSlider.value, secondSlider);
        const output = await page.evaluate(el => el.innerHTML, lineHeightOutput);

        await page.waitForTimeout(100);

        const lineHeight = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).lineHeight;
        });

        // Expect the lineheight not to be lineHeightBefore unless it is the max value of 592.5px
        if (parseInt(lineHeightBefore.replace('px', '')) >= 570) {
            expect(value).toBe(valueBefore);
            expect(output).toBe(valueBefore + "%");
            expect(lineHeight).toBe(lineHeightBefore);
        } else {
            expect(value).toBe((parseInt(valueBefore) + 1).toString());
            expect(output).toBe((parseInt(valueBefore) + 1).toString() + "%");
            expect(lineHeight).not.toBe(lineHeightBefore);
        }
    })

    test('Should be able to change letter spacing', async () => {

        const letterSpacingOutput = await page.$("#letterSpacingOutput");
        const sliders = await page.$$('input[type=range]');
        const thirdSlider = sliders[2];

        const valueBefore = await page.evaluate(thirdSlider => thirdSlider.value, thirdSlider);

        const letterSpacingBefore = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).letterSpacing;
        });

        await thirdSlider.focus();
        await thirdSlider.press('ArrowRight');

        const value = await page.evaluate(thirdSlider => thirdSlider.value, thirdSlider);
        const output = await page.evaluate(el => el.innerHTML, letterSpacingOutput);

        await page.waitForTimeout(100);

        const letterSpacing = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).letterSpacing;
        });

        if (valueBefore === '200') {
            expect(value).toBe(valueBefore);
            expect(output).toBe(valueBefore + "%");
            expect(letterSpacing).toBe(letterSpacingBefore);
        } else{
            expect(value).toBe((parseInt(valueBefore) + 1).toString());
            expect(output).toBe((parseInt(valueBefore) + 1).toString() + "%");
            expect(letterSpacing).not.toBe(letterSpacingBefore);
        }

    });

    /**
     * From the lay-out container, check whether you can change the font family by clicking the first available button for changing the fontsize. Also checks if the CSS is changed properly.
     * Fails if 'Should be able to navigate to text layout container' fails.
     */
    test('Should be able to change font family', async () => {

        const elements = await page.$$('.font-family-option');
        const firstElement = elements[0];

        await firstElement.click();
        const className = await page.evaluate(el => el.className, firstElement);
        expect(className.split(" ").includes("selected")).toBe(true);

        await page.waitForTimeout(100);

        const fontFamily = await page.evaluate(() => {
            return window.getComputedStyle(document.querySelector('#reader123')).fontFamily;
        });

        expect(fontFamily).toBe('Overpass');

    })

    afterAll(async () => {
        await browser.close();
    })

});