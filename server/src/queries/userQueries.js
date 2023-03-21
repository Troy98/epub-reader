const User = require('../models/user');

function createUser(username) {
  const newUser = new User({
    username: username
  });
  return newUser.save();
}

async function getUserById(id) {
  return User.findById(id, {ebooks: 0});
}

async function getUserByUsername(username) {
  return User.findOne({username: username}, {ebooks: 0});
}

async function setUserLayout(id, value, layout) {
  if (layout === 'fontSize') {
    return User.updateOne({_id: id}, {$set: {fontSize: value}})
  }
  else if (layout === 'lineHeight') {
    return User.updateOne({_id: id}, {$set: {lineHeight: value}})
  }
  else if (layout === 'fontFamily') {
    return User.updateOne({_id: id}, {$set: {fontFamily: value}})
  }
  return null;
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  setUserLayout,
}