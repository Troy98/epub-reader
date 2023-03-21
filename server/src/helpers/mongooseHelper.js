let mongoose = require('mongoose');
const User = require('../models/user');
const userSeedScript = require('../seed/app_seed_script');
const e2eSeedScript = require('../seed/e2e_seed_script');

let makeConnection = () => {
  mongoose.connect('mongodb://localhost:27017/readable-reader');
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async function () {
    await userSeedScript();
    console.log("DB connected!");
  });
}

let makeE2ETestConnection = () => {
  mongoose.connect('mongodb://localhost:27017/readable-reader-e2e');
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async function () {
    await e2eSeedScript();
    console.log("DB connected!");
  });
}

let makeMockConnection = () => {
  mongoose.connect('mongodb://localhost:27017/readable-reader-mock');
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("MOCK DB connected!");
  });
}

let closeConnection = () => {
  mongoose.connection.close();
}

let getMongoose = () => {
  return mongoose;
}

module.exports = {
  makeConnection,
  makeMockConnection,
  makeE2ETestConnection,
  closeConnection,
  getMongoose
}
