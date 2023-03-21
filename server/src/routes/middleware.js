const fs = require('fs');

/**
 * Middleware to check if the user session is set
 */
const createSessionMiddleware = () => {
  return (async (req, res, next) => {
    if (req.session && req.session?._id && req.session?.user) {
      next();
    } else {
      let error = new Error('Session niet gevonden');
      error.status = 401;
      return next(error);
    }
  });
}

const createUserValidationMiddleware = () => {
  return (async (req, res, next) => {
    const { username } = req.body
    if (username.trim().length === 0) {
      let error = new Error('Gebruikersnaam mag niet leeg zijn');
      error.status = 400;
      return next(error);
    }
    if (username.length > 20) {
      let error = new Error('Een gebruikersnaam mag niet langer dan 20 karakters zijn');
      error.status = 400;
      return next(error);
    }
    if (username.length <= 2) {
      let error = new Error('Een gebruikersnaam moet op zijn minst 2 karakters lang zijn');
      error.status = 400;
      return next(error);
    }
    next()
  })
}

const userValidationMiddleware = () => {
  return (async (req, res, next) => {
    const { username } = req.body
    if (username.trim().length === 0) {
      let error = new Error('Gebruikersnaam mag niet leeg zijn');
      error.status = 400;
      return next(error);
    }
    next()
  })
}

const EBookValidationMiddleware = () => {
  const eBookPath = 'static/ebooks/';

  return (async (req, res, next) => {

    if (!req.files) {
      const error = new Error("Geen EBook geüpload")
      error.status = 404
      return next(error)
    }

    const EBook = req.files.file
    const bookName = EBook.name.split(".")[0];

    // 104857600 = 100MB
    if (EBook.size >= 104857600) {
      const error = new Error("Bestand is te groot")
      error.status = 413
      return next(error)
    }

    if (EBook.mimetype !== "application/epub+zip") {
      const error = new Error("Bestand formaat is niet juist. Formaat moet \".epub\" zijn")
      error.status = 415
      return next(error)
    }

    if (EBook.name === undefined || EBook.name === "") {
      const error = new Error("Geen bestandsnaam")
      error.status = 400
      return next(error)
    }

    if (fs.existsSync(`${eBookPath}${req.session._id}/${bookName}`)) {
      const error = new Error("Een boek met deze naam bestaat al.")
      error.status = 403
      return next(error)
    }

    next()
  })
}

const changeLayoutValidationMiddleware = () => {
  return (async (req, res, next) => {
    const value = req.body.value;
    const valueType = req.body.valueType;

    if (req.session._id === undefined || req.session.user === undefined) {
      const error = new Error("Sessie is verlopen")
      error.status = 401
      return next(error)
    }

    if (value === undefined) {
      const error = new Error("Geen waarde meegegeven")
      error.status = 400
      return next(error)
    }

    if (typeof value === 'string' && value.length <= 0) {
      const error = new Error("Waarde moet groter zijn dan 0")
      error.status = 422
      return next(error)
    }

    if (typeof value === 'number' && value <= 0) {
      const error = new Error("Waarde moet groter zijn dan 0")
      error.status = 422
      return next(error)
    }

    if (valueType && valueType !== 'px' && valueType !== 'em' && valueType !== 'rem' && valueType !== '%') {
      const error = new Error("Waarde type moet px, em, rem of % zijn")
      error.status = 422
      return next(error)
    }

    next()
  })
}

const validateLayoutConstraintsMiddleware = () => {
  return (async (req, res, next) => {
    const value = req.body.value;
    const valueType = req.body.valueType;
    const typeOfLayout = req.body.typeOfLayout;

    switch(typeOfLayout) {

      case 'fontSize':
        if (value > 400) {
          const error = new Error(`Tekstgrootte mag niet groter zijn dan 400${valueType}`)
          error.status = 422
          return next(error)
        } else if (value < 40) {
          const error = new Error(`Tekstgrootte mag niet kleiner zijn dan 40${valueType}`)
          error.status = 422
          return next(error)
        }
        break;

      case 'lineHeight':
        if (value > 250) {
          const error = new Error(`Lijnhoogte mag niet groter zijn dan 250${valueType}`)
          error.status = 422
          return next(error)
        } else if (value < 80) {
          const error = new Error(`Lijnhoogte mag niet kleiner zijn dan 80${valueType}`)
          error.status = 422
          return next(error)
        }
        break;

      case 'letterSpacing':
        if (value > 200) {
          const error = new Error(`Letterafstand mag niet groter zijn dan 200${valueType}`)
          error.status = 422
          return next(error)
        } else if (value < 0) {
          const error = new Error(`Letterafstand mag niet kleiner zijn dan 0${valueType}`)
          error.status = 422
          return next(error)
        }
        break;

      case 'backgroundColor':
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          const error = new Error("Achtergrondkleur heeft geen geldige hex kleur")
          error.status = 422
          return next(error)
        }
        break;

      case 'textColor':
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          const error = new Error("Tekstkleur heeft geen geldige hex kleur")
          error.status = 422
          return next(error)
        }
        break;

      case 'accentColor':
        const parsedValue = JSON.parse(value);
        if (!/^#[0-9A-F]{6}$/i.test(parsedValue.hexFormat)) {
          const error = new Error("Geen geldige hex kleur")
          error.status = 422
          return next(error)
        }
        break;

      case 'fontFamily':
        if (valueType.length !== 0) {
          const error = new Error("Geen geldige font")
          error.status = 422
          return next(error)
        }
        break;

      default:
        const error = new Error("Geen geldige layout")
        error.status = 422
        return next(error)
        break;

    }

    next();

  });
}

module.exports = {
  createSessionMiddleware,
  createUserValidationMiddleware,
  EBookValidationMiddleware,
  validateLayoutConstraintsMiddleware,
  changeLayoutValidationMiddleware,
  userValidationMiddleware
}