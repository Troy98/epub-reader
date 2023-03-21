const session = require('express-session');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const http = require('http');
const { makeConnection, makeE2ETestConnection } = require("./helpers/mongooseHelper");
const { setSocketIOServer } = require("./socket.io");
require('dotenv').config({ path: '../.env' });

const app = express();
const staticFolder = __dirname + '/static';

if (process.env.PRODUCTION === 'true') {
  makeConnection();
} else {
  console.log('Running in test mode');
  makeE2ETestConnection();
}

// Cors options
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));
app.use(fileUpload({
  createParentPath: true
}));

app.use('/static', express.static(staticFolder))

app.use(bodyParser.json({
  extended: true,
  limit: '500mb'
}));

const sessionParser = session({
  saveUninitialized: false,
  secret: 'q7psq44ajwszl1vzp0f08',
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months
  },
});
app.use(sessionParser);

const httpServer = http.createServer(app);


/// Routes
app.use('/api/v1/helper', require('./routes/helperRoutes'));
app.use('/api/v1/reader', require('./routes/readerRoutes'));

app.use((err, req, res) => {
  res.status(err.status ? err.status : 500).json({
    error: err.message ? err.message : 'Something went wrong',
  });
});


const socketIOServer = new Server(httpServer);
setSocketIOServer(socketIOServer);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
socketIOServer.use(wrap(sessionParser));

socketIOServer.on('connection', (socket) => {
  console.log('a user connected', socket.request.session.user);

  socket.on('join', () => {
    socket.join(socket.request.session._id);
  });
});

// Start the server.
const port = process.env.PORT || 4000;
httpServer.listen(port, () => console.log(`Listening on http://localhost:${port}`));
