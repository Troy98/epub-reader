'use strict';

const mongoose = require('mongoose');
const User = require('../../models/user');
const Ebook = require('../../models/ebook');
const { makeMockConnection, closeConnection } = require("../../helpers/mongooseHelper");

beforeAll(async () => await makeMockConnection());

afterAll(async () => {
  await User.deleteMany({})
  await closeConnection()
});

describe('User Creation Tests', () => {

  afterEach(async () => await User.deleteMany({}));

  test("create a valid user", async () => {
    const user = await User.create({ username: "LarsTijsmaTest" });

    expect(user.username).toBe("LarsTijsmaTest");
  });

  test("create user without required field username, should fail", async () => {
    let err;
    try {
      const userWithoutRequiredField = new User({ username: '' });
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    } finally {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.username).toBeDefined();
    }
  });

  test("create user with duplicate username, should fail", async () => {
    let err;
    try {
      await User.create({ username: "testuser" });
      await User.create({ username: "testuser" });
      await User.create({ username: "testuser" });
    }
    catch (error) {
      err = error;
    } finally {
      expect(err.code).toBe(11000);
    }

  });

  test("create user with username longer than 20 characters, should fail", async () => {
    let err;
    try {
      const userWithLongUsername = new User({ username: "thisusernameiswaytoolong" });
      await userWithLongUsername.save();
    }
    catch (error) {
      err = error;
    } finally {
      expect(err.errors.username.message).toBe("Gebruikersnaam mag maximaal 20 karakters lang zijn");
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  test("create user with username shorter than 3 characters, should fail", async () => {
    let err;
    try {
      const userWithShortUsername = new User({ username: "te" });
      await userWithShortUsername.save();
    }
    catch (error) {
      err = error;
    } finally {
      expect(err.errors.username.message).toBe("Gebruikersnaam moet minimaal 3 karakters lang zijn");
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });
});


//delete is not working properly.
describe('User E-Book Tests', () => {

  test('Delete E-Book from the user', async () => {
    const user = await User.create({ username: "GUVENBOEK" });
    await user.createEBook("EBook1", "Author 1", "static/ebooks/book/cover", "static/ebooks/book");
    const resultInsert = await User.getEBooks(user._id);
    const ebook = resultInsert[0];
    await user.deleteEBook(ebook._id);
    const result = await User.getEBooks(user._id);
    expect(result.length).toBe(0);
  });
});