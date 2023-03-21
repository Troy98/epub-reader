'use strict';

const mongoose = require('mongoose');
const User = require('../../models/user');
const EBook = require('../../models/ebook');
const {makeMockConnection, closeConnection} = require("../../helpers/mongooseHelper");

const mockEbook = {
	title: 'testEbook',
	author: 'John Doe',
	cfi: 'testCfi',
	coverUrl: 'testCoverUrl',
	path: 'testPath'
}
describe('EBook Tests', () => {
	beforeAll(async () => await makeMockConnection());

	afterEach(async () => await User.deleteMany({}));

	afterAll(async () => await closeConnection());

	test('Empty title', async () => {
		let err;
		try {
			await EBook.create({ ...mockEbook, title: '' });
		} catch (e) {
			err = e;
		} finally {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(err.errors.title.message).toBe('Titel is verplicht');
		}
	});

	test('Empty author', async () => {
		let err;
		try {
			await EBook.create({ ...mockEbook, author: '' });
		} catch (e) {
			err = e;
		} finally {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(err.errors.author.message).toBe('Auteur is verplicht');
		}
	});

	test('Empty coverUrl', async () => {
		let err;
		try {
			await EBook.create({ ...mockEbook, coverUrl: '' });
		} catch (e) {
			err = e;
		} finally {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(err.errors.coverUrl.message).toBe('Afbeelding is verplicht');
		}
	});

	test('Empty ScrollPosition', async () => {
		let err;
		try {
			await EBook.create({ ...mockEbook, scrollPosition: '' });
		} catch (e) {
			err = e;
		} finally {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(err.errors.scrollPosition.message).toBe('ScrollPositie is verplicht');
		}
	});

	test('Empty path', async () => {
		let err;
		try {
			await EBook.create({ ...mockEbook, path: '' });
		} catch (e) {
			err = e;
		} finally {
			expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
			expect(err.errors.path.message).toBe('Pad is verplicht');
		}
	});
});
