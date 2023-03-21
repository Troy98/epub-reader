const puppeteer = require('puppeteer-extra');
const {executablePath} = require('puppeteer')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

jest.setTimeout(30000);

const pathToFiles = `${__dirname}\\files`;

const pietjeBelEpub = `${pathToFiles}/pg58563-images.epub`;
const wrongFileType = `${pathToFiles}/AAiW.png`;

const email = "readablereadertesting@gmail.com";
const password = "";

describe('Uploading', () => {
  let helper, helperPage;
  let slechtziende, slechtziendePage;

  beforeAll(async () => {
    helper = await puppeteer.launch({
      headless: false,
      slowMo: 40,
      executablePath: executablePath(),
    });
    slechtziende = await puppeteer.launch({
      executablePath: executablePath(),
    });

    helperPage = await helper.newPage();
    slechtziendePage = await slechtziende.newPage();

    await helperPage.goto('http://localhost:3000/');
    await helperPage.type('#username', 'newuser');
    await helperPage.click('#default-checkbox');
    await helperPage.click('#inloggen');
    await helperPage.waitForSelector('#library', {visible: true, timeout: 3000});

    await slechtziendePage.goto('http://localhost:3000/');
    await slechtziendePage.type('#username', 'newuser');
    await slechtziendePage.click('#inloggen');
    await slechtziendePage.waitForSelector('#library', {visible: true, timeout: 3000});

    if (await helperPage.$('#noBooks') === null) {
      await helperPage.waitForSelector('#verwijderen', { visible: true, timeout: 3000 });
      await helperPage.click('#verwijderen');
    }
  });

  afterAll(() => {
    helper.close();
    slechtziende.close();
  });

  test('should be able to upload a book', async () => {
    await helperPage.waitForSelector('#uploaden');
    await helperPage.click('#uploaden');
    await helperPage.waitForSelector('#upload_file');

    const inputUploadHandle = await helperPage.$('#upload_file');
    await inputUploadHandle.uploadFile(pietjeBelEpub);
    await helperPage.waitForSelector('#local-uploading', { hidden: true });
    await helperPage.keyboard.press('Escape');


    await helperPage.waitForSelector('#swiper', { visible: true, timeout: 3000 });
    const books = await helperPage.$eval('#swiper', (el) => el.textContent);
    const text = books.replaceAll('­', '');

    expect(text).toContain('Pietje');
    expect(helperPage.url()).toBe('http://localhost:3000/bibliotheek');

    // Expect the book to be in the other browsers library
    await slechtziendePage.waitForSelector('#swiper', {visible: true, timeout: 3000});
    const book_title = await slechtziendePage.$eval('#swiper', (el) => el.textContent);
    // Remove the all hyphens from the title
    const title = book_title.replaceAll('­', '');

    expect(helperPage.url()).toBe('http://localhost:3000/bibliotheek');
    expect(title).toContain('Pietje');
  });

  test('should not be able to upload a book with the wrong file type', async () => {
    await helperPage.click('#uploaden');
    await helperPage.click('#upload_file');
    const inputUploadHandle = await helperPage.$('#upload_file');
    await inputUploadHandle.uploadFile(wrongFileType);
    const error = await helperPage.$eval('#upload-error', (el) => el.textContent);
    expect(error).toContain('Bestand formaat is niet juist. Formaat moet ".epub" zijn');
    await helperPage.keyboard.press('Escape');
    expect(helperPage.url()).toBe('http://localhost:3000/bibliotheek');
  });

  test('should be able to delete a book', async () => {
    await helperPage.click('#verwijderen');
    await helperPage.waitForSelector('#noBooks', { visible: true, timeout: 3000 });

    const noBooks = await helperPage.$eval('#noBooks', (el) => el.textContent);
    const text = noBooks.replaceAll('­', '');
    expect(text).toContain('Nog geen boeken in uw bibliotheek');
  });

  test('should be able to upload a book with dropbox', async () => {
    await helperPage.waitForSelector('#uploaden', { visible: true, timeout: 3000 });
    await helperPage.click('#uploaden');
    await helperPage.waitForSelector('#dropbox-upload', { visible: true, timeout: 3000 });


    const [popup] = await Promise.all([
      new Promise(resolve => helperPage.once('popup', resolve)),
      helperPage.click('#dropbox-upload'),
    ]);

    await popup.bringToFront();

    await popup.waitForSelector('.text-input-input', { visible: true });
    await popup.type('.text-input-input', email);
    await popup.type('.password-input', password);
    await popup.click('.login-button')

    await popup.waitForSelector('.dropins-chooser-files-list', { visible: true });
    await popup.click('.dropins-item-row-clickable');
    await popup.click('.dig-Button--primary');

    await helperPage.waitForSelector('#dropbox-uploading', { hidden: true });
    await helperPage.keyboard.press('Escape');

    await helperPage.waitForSelector('#swiper', { visible: true, timeout: 5000 });
    const books = await helperPage.$eval('#swiper', (el) => el.textContent);
    const text = books.replaceAll('­', '');

    expect(text).toContain('Harry');
    expect(helperPage.url()).toBe('http://localhost:3000/bibliotheek');

    await slechtziendePage.waitForSelector('#swiper', {visible: true, timeout: 5000});
    const book_title = await slechtziendePage.$eval('#swiper', (el) => el.textContent);
    // Remove the all hyphens from the title
    const title = book_title.replaceAll('­', '');

    expect(helperPage.url()).toBe('http://localhost:3000/bibliotheek');
    expect(title).toContain('Harry');

    await slechtziendePage.waitForSelector('#library', {visible: true, timeout: 3000});

    if (await helperPage.$('#noBooks') === null) {
      await helperPage.click('#verwijderen');
      await helperPage.waitForSelector('#noBooks', {visible: true, timeout: 3000});
    }
  });
});