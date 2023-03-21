const { createSessionMiddleware, userValidationMiddleware } = require("./middleware");
const router = require('express').Router();
const User = require("../models/user");

/**
 * Login user (Helper or Reader)
 */
router.put('/users', userValidationMiddleware(), async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await User.getUserByUsernameWithoutEBooks(username.toLowerCase());

    if (user) {
      req.session._id = user._id.toString();
      req.session.user = user.username;
      req.session.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Invalide gegevens' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const user = await User.getUserByIdWithoutEBooks(req.session._id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }
  } catch (err) {
    next(err);
  }
});

router.use(createSessionMiddleware());
/**
 * Validate that the user in the local storage is the same as the user in the session
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.getUserByIdWithoutEBooks(id);
    if (user && user.username === req.session.user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Token en Id komen niet overeen' });
    }
  } catch (err) {
    next(err);
  }
});


/**
 * Update book Scroll position
 */
router.put('/books/:bookId', async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { scrollPosition } = req.body;
    const id = req.session._id;

    const user = await User.findById(id);
    await user.updateScrollPosition(bookId, scrollPosition);
    res.status(200).json({ message: "scrollPosition updated" });

  } catch (err) {
    next(err);
  }
});

/**
 * Get selected book
 */
router.get('/books/:bookID', async (req, res, next) => {
  try {
    const { bookID } = req.params;
    const id = req.session._id;

    const ebook = await User.getEBook(id, bookID);

    if (ebook) {
      res.status(200).json(ebook);
    }
    else {
      res.status(404).json({ error: 'Ebook niet gevonden' });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Get all the books of the user
 */
router.get('/books', async (req, res, next) => {
  try {
    const id = req.session._id;

    const ebooks = await User.getEBooks(id);

    if (ebooks) {
      res.status(200).json(ebooks);
    }
    else {
      res.status(404).json({ error: 'Geen ebooks gevonden' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;