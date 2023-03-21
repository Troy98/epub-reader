const router = require('express').Router();
const { broadCastToReader } = require("../socket.io");
const { userValidationMiddleware, EBookValidationMiddleware, createSessionMiddleware, changeLayoutValidationMiddleware, validateLayoutConstraintsMiddleware } = require("./middleware");
const User = require("../models/user");
const EBook = require("../models/ebook");
const fs = require('fs');

const eBookPath = 'static/ebooks/';

/**
 * Upload a new book
 */
router.post("/books", [EBookValidationMiddleware(), createSessionMiddleware()], async (req, res, next) => {
  try {
    const bookData = JSON.parse(req.body.data);

    const Ebook = req.files.file;

    const bookName = Ebook.name.split(".")[0];

    const user = await User.findById(req.session._id);

    const bookExists = user.ebooks.find(book => book.title === bookData.title);

    if (bookExists) {
      const error = new Error("Boek bestaat al");
      error.status = 400
      return next(error)
    }

    const eBookInstance = new EBook();
    const cover = await eBookInstance.convertCover(req.session._id, bookName, bookData);

    await eBookInstance.saveEBook(req.session._id, bookName, Ebook);

    await user.createEBook(bookData.title, bookData.author, cover, `${eBookPath}${req.session._id}/${bookName}/${Ebook.name}`);

    broadCastToReader("NEW_BOOK", req.session._id);
    res.status(200).json({ message: "EBook created" });

  } catch (e) {
    next(e)
  }
})

/**
 * Creates a new user
 */
router.post('/users', userValidationMiddleware(), async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.create({ username: username.toLowerCase() });
    res.status(201).json(user);

  } catch (err) {
    if (err.errors) {
      return res.status(403).json({ error: err.errors.username.message });
    }

    if (err.code === 11000) {
      return res.status(403).json({ error: 'Gebruikersnaam is al in gebruik' });
    }
    next(err);
  }
});

router.put('/users/layout', changeLayoutValidationMiddleware(), validateLayoutConstraintsMiddleware(), async (req, res, next) => {
  try {

    const value = req.body.value;
    const valueType = req.body.valueType;
    const typeOfLayout = req.body.typeOfLayout;

    const id = req.session._id;

    let result;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("Gebruiker niet gevonden")
      error.status = 404
      throw error
    }

    if (valueType !== undefined) {
      const valueCombined = value + valueType;
      result = await user.setLayout(valueCombined, typeOfLayout);
    }
    else {
      result = await user.setLayout(value, typeOfLayout);
    }

    broadCastToReader("BOOK_LAYOUT_CHANGED", req.session._id);
    res.status(200).json(result);

  } catch (e) {
    next(e);
  }
});

router.delete('/books/:bookID', async (req, res, next) => {
  try {
    const { bookID } = req.params;
    const id = req.session._id;

    const user = await User.findById(id);

    const eBook = await User.getEBook(id, bookID);

    //remove the last / and word from the path
    const path = eBook.path.split("/").slice(0, -1).join("/");

    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });

    await user.deleteEBook(bookID);
    broadCastToReader("DELETE_BOOK", req.session._id, bookID);
    res.status(200).json({ message: "EBook deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;