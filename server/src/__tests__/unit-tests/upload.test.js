'use strict'
const Ebook = require("../../models/ebook")
const { makeMockConnection, closeConnection } = require("../../helpers/mongooseHelper");
const mongoose = require('mongoose');


describe('Ebook creation', () => {
    beforeAll(async () => await makeMockConnection());

    afterEach(async () => await Ebook.deleteMany({}));

    afterAll(async () => await closeConnection());

    test('Create ebook', async () => {
        const ebook = await new Ebook({
            title: 'mockTitle',
            author: 'mockAuthor',
            coverUrl: 'book.png',
            path: '/books'
        })

        await expect(ebook.title).toBe("mockTitle")
        await expect(ebook.author).toBe("mockAuthor")
        await expect(ebook.coverUrl).toBe("book.png")
        await expect(ebook.path).toBe("/books")
    });

    test('Create ebook without title', async () => {
        let err;
        try {
            const EbookWithoutTitle = await new Ebook({
                title: '',
                author: 'mockAuthor',
                coverUrl: 'book.png',
                path: '/books'
            })
            await EbookWithoutTitle.save()
        } catch (error) {
            err = error
        } finally {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        }
    });

    test('Create ebook without author', async () => {
        let err;
        try {
            const EbookWithoutTitle = await new Ebook({
                title: 'mockTitle',
                author: '',
                coverUrl: 'book.png',
                path: '/books'
            })
            await EbookWithoutTitle.save()
        } catch (error) {
            err = error
        } finally {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        }
    });

    test('Create ebook without coverUrl', async () => {
        let err;
        try {
            const EbookWithoutTitle = await new Ebook({
                title: 'mockTitle',
                author: 'mockAuthor',
                coverUrl: '',
                path: '/books'
            })
            await EbookWithoutTitle.save()
        } catch (error) {
            err = error
        } finally {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        }
    });

    test('Create ebook without path', async () => {
        let err;
        try {
            const EbookWithoutTitle = await new Ebook({
                title: 'mockTitle',
                author: 'mockAuthor',
                coverUrl: '/book.png',
                path: ''
            })
            await EbookWithoutTitle.save()
        } catch (error) {
            err = error
        } finally {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        }
    });
});

