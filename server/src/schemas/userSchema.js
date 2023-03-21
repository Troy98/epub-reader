const mongoose = require('mongoose');
const EBookSchema = require('./ebookSchema');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'Gebruikersnaam is al in gebruik'],
    minlength: [3, 'Gebruikersnaam moet minimaal 3 karakters lang zijn'],
    maxlength: [20, 'Gebruikersnaam mag maximaal 20 karakters lang zijn'],
  },
  preferences: {
    fontSize: {
      type: String,
      default: '50px',
    },
    lineHeight: {
      type: String,
      default: '125%',
    },
    backgroundColor: {
      type: String,
      default: '#000000',
    },
    accentColor: {
      tailwindFormat: {
        type: String,
        default: 'accent',
      },
      hexFormat: {
        type: String,
        default: '#334B99',
      },
    },
    textColor: {
      type: String,
      default: '#ffffff',
    },
    fontFamily: {
      type: String,
      default: 'Atkinson Hyperlegible',
    },
    letterSpacing: {
      type: String,
      default: '0.1em',
    },
  },
  ebooks: {
    type: [EBookSchema],
    required: true,
    default: [],
  }
});

const User = mongoose.model("user", userSchema);

userSchema.methods.createEBook = async function (title, author, coverUrl, path) {
  await User.updateOne({ _id: this._id }, {
    $push: {
      ebooks: {
        title: title,
        author: author,
        coverUrl: coverUrl,
        path: path,
      }
    },
  }, { new: true });
};

userSchema.methods.updateScrollPosition = async function (ebookId, scrollPosition) {
  await User.updateOne({ _id: this._id }, {
    $set: {
      "ebooks.$[elem].scrollPosition": scrollPosition,
    }
  }, {
    "arrayFilters": [
      {
        "elem._id": ebookId
      }
    ],
    new: true
  });
};

userSchema.methods.deleteEBook = async function (ebookId) {
  await User.updateOne({ _id: this._id }, {
    $pull: {
      ebooks: {
        _id: ebookId,
      }
    },
  }, { new: true });
};

userSchema.methods.setLayout = async function (value, layout) {
  switch (layout) {
    case 'fontSize':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.fontSize': value } });
    case 'lineHeight':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.lineHeight': value } });
    case 'fontFamily':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.fontFamily': value } });
    case 'backgroundColor':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.backgroundColor': value } });
    case 'textColor':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.textColor': value } });
    case 'letterSpacing':
      return User.updateOne({ _id: this._id }, { $set: { 'preferences.letterSpacing': value } });
    case 'accentColor':
      const parsedValue = JSON.parse(value);
      return User.updateOne({ _id: this._id }, {
        $set: {
          "preferences.accentColor.tailwindFormat": parsedValue.tailwindFormat,
          "preferences.accentColor.hexFormat": parsedValue.hexFormat
        }
      });
    default:
      return;
  }
}

userSchema.statics.getUserByIdWithoutEBooks = async function (id) {
  return User.findById(id, { ebooks: 0 });
};

userSchema.statics.getUserByUsernameWithoutEBooks = async function (username) {
  return User.findOne({ username: username }, { ebooks: 0 });
};

userSchema.statics.getEBooks = async function (userId) {
  const user = await User.findById(userId, { _id: 0, username: 0 }).select('ebooks');
  return user.ebooks;
};

userSchema.statics.getEBook = async function (userId, ebookId) {
  const user = await User.findById(userId, { _id: 0, username: 0 }).select('ebooks');
  return user.ebooks.find(ebook => ebook._id == ebookId);
};

module.exports = userSchema;