const express = require('express');
const session = require('express-session');
const supertestSession = require('supertest-session');
const request = require('supertest');
const helperRoutes = require('../routes/helperRoutes');
const readerRoutes = require('../routes/readerRoutes');

const { makeMockConnection, closeConnection } = require("../helpers/mongooseHelper");
const User = require('../models/user');
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { Server } = require("socket.io");
const { setSocketIOServer } = require("../socket.io");
const http = require("http");

const mockApp = express();
mockApp.use(express.json());

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months
    },
});
mockApp.use(sessionParser);

const httpServer = http.createServer(mockApp);

mockApp.use(bodyParser.json({
    extended: true,
    limit: '500mb'
}));

mockApp.use(fileUpload({
    createParentPath: true
}));

mockApp.use('/api/v1/helper', helperRoutes);
mockApp.use('/api/v1/reader', readerRoutes);


const socketIOServer = new Server(httpServer);
setSocketIOServer(socketIOServer);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
socketIOServer.use(wrap(sessionParser));

const username = 'testuser';

beforeAll(async () => {
    makeMockConnection();
});

/**
 * Tests whether registration works
 */
describe('Endpoint tests for registering a new user', () => {

    it('POST /api/v1/helper/users - success', async () => {
        const { statusCode } = await request(mockApp).post('/api/v1/helper/users').send({
            username: username
        });
        expect(statusCode).toBe(201);
    });

    it('POST /api/v1/helper/users - failure - username empty', async () => {
        const { statusCode } = await request(mockApp).post('/api/v1/helper/users').send({
            username: ''
        });
        expect(statusCode).toBe(400);
    });


    it('POST /api/v1/helper/users - failure - username exists', async () => {

        const { statusCode } = await request(mockApp).post('/api/v1/helper/users').send({
            username: username
        });

        expect(statusCode).toBe(403);
    });

    it('POST /api/v1/helper/users - failure - username too short', async () => {
        const { statusCode } = await request(mockApp).post('/api/v1/helper/users').send({
            username: 't'
        });
        expect(statusCode).toBe(403);
    });

    it('POST /api/v1/helper/users - failure - username too long', async () => {
        const { statusCode } = await request(mockApp).post('/api/v1/helper/users').send({
            username: 'lmaolmaolmaolmaolmaolmaolmaolmaolmaolmaolmaolmao'
        });
        expect(statusCode).toBe(403);
    });
});

/**
 * Tests whether login works
 */
describe('Endpoint tests for logging in a user', () => {


    it('PUT /api/v1/reader/users - success', async () => {

        await User.create({ username: "kevin" });

        const { statusCode } = await request(mockApp).put('/api/v1/reader/users').send({
            username: "kevin"
        })

        expect(statusCode).toBe(200);

    });

    it('PUT /api/v1/reader/users - failure - non existent username', async () => {
        const { statusCode } = await request(mockApp).put('/api/v1/reader/users').send({
            username: "kevin1234"
        })
        expect(statusCode).toBe(404);

    });

    it('PUT /api/v1/reader/users - failure - username empty', async () => {
        const { statusCode } = await request(mockApp).put('/api/v1/reader/users').send({
            username: ''
        });
        expect(statusCode).toBe(400);
    });

});

describe('Endpoint tests for validate that the user in the local storage is the same as the user in the session', () => {
    let testSession = null;
    let authenticatedSession = null;

    beforeEach(async function () {
        testSession = supertestSession(mockApp);

        await testSession.put('/api/v1/reader/users').send({
            username: username
        });
        authenticatedSession = testSession;
    });

    it('GET /api/v1/reader/users/:id - success', async () => {
        const user = await User.findOne({ username });
        const { statusCode } = await authenticatedSession.get('/api/v1/reader/users/' + user._id.toString());
        expect(statusCode).toBe(200);
    });

    it('GET /api/v1/reader/users/:id - check if sessions exists', async () => {
        const user = await User.findOne({ username });
        const { statusCode } = await request(mockApp).get('/api/v1/reader/users/' + user._id.toString());
        expect(statusCode).toBe(401);
    });

    it('GET /api/v1/reader/users/:id - failure - tokens dont match', async () => {
        const { statusCode } = await authenticatedSession.get('/api/v1/reader/users/5f9f1b9b9b9b9b9b9b9b9b9b');
        expect(statusCode).toBe(404);
    });
});

describe('Ebook upload', () => {
    let testSession = null;
    let authenticatedSession = null;


    beforeEach(async function () {
        testSession = supertestSession(mockApp);
        await testSession.put('/api/v1/reader/users').send({
            username: username,
        })
        authenticatedSession = testSession;
    });

    it('POST /api/v1/helper/books - success', async () => {
        const testFile = path.join(__dirname, 'testFile/AAiW.epub');
        await authenticatedSession.post('/api/v1/helper/books')
            .attach('file', testFile)
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) })
            .expect(200);
    });

    it('POST /api/v1/helper/books - failure - no file', async () => {
        await authenticatedSession.post('/api/v1/helper/books')
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) })
            .expect(404);
    });

    it('POST /api/v1/helper/books - failure - file too big', async () => {
        const testFile = path.join(__dirname, 'testFile/100MB.zip');
        await authenticatedSession.post('/api/v1/helper/books')
            .attach('file', testFile)
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) })
            .expect(413);
    });

    it('POST /api/v1/helper/books - failure - wrong file type', async () => {
        const testFile = path.join(__dirname, 'testFile/wrong-file-type.pdf');
        await authenticatedSession.post('/api/v1/helper/books')
            .attach('file', testFile)
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) })
            .expect(415);
    });

    it('POST /api/v1/helper/books - failure - book already exists', async () => {
        const testFile = path.join(__dirname, 'testFile/AAiW.epub');
        await authenticatedSession.post('/api/v1/helper/books')
            .attach('file', testFile)
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) });
        await authenticatedSession.post('/api/v1/helper/books')
            .attach('file', testFile)
            .field({ data: JSON.stringify({ title: 'test', author: 'test' }) })
            .expect(403);
    });
});

describe('EBooks tests', () => {
    let testSession = null;
    let authenticatedSession = null;


    beforeEach(async function () {
        testSession = supertestSession(mockApp);
        await testSession.put('/api/v1/reader/users').send({
            username: username,
        });
        authenticatedSession = testSession;
    });

    it('GET /api/v1/reader/books - success', async () => {
        await authenticatedSession.get('/api/v1/reader/books')
            .expect(200);
    });

    it('PUT /api/v1/reader/books/:bookID - success', async () => {
        // Fetch the uploaded book
        const response = await authenticatedSession.get('/api/v1/reader/books');
        const bookID = response.body[0]._id;
        // Update the CFI
        await authenticatedSession.put('/api/v1/reader/books/' + bookID).send({
            cfi: "blalnigiwont1"
        })
            .expect(200);
    });

    it('GET /api/v1/reader/books/:bookID - success', async () => {
        // Fetch the uploaded book
        const response = await authenticatedSession.get('/api/v1/reader/books')
        const bookID = response.body[0]._id;
        // Get the book
        await authenticatedSession.get('/api/v1/reader/books/' + bookID)
            .expect(200);
    });

    it('GET /api/v1/reader/books/:bookID - failure - non existent book', async () => {
        let bookID = "5f9f1b9b9b9b9b9b9b9b9b9b";
        // Get the book
        await authenticatedSession.get('/api/v1/reader/books/' + bookID)
            .expect(404);
    });

    it('GET /api/v1/reader/books - failure - no session', async () => {
        const { statusCode } = await request(mockApp).get('/api/v1/reader/books');
        expect(statusCode).toBe(401);
    });
});

describe('Endpoint tests for changing the style of the website', () => {
    let testSession = null;
    let authenticatedSession = null;

    beforeEach(async function () {
        testSession = supertestSession(mockApp);
        await testSession.put('/api/v1/reader/users').send({
            username: username,
        });
        authenticatedSession = testSession;
    });

    it('PUT /api/v1/helper/users/layout - fontSize - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "100",
            valueType: "px",
            typeOfLayout: "fontSize"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - lineHeight - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "100",
            valueType: "%",
            typeOfLayout: "lineHeight"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - fontFamily - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "Overpass",
            valueType: "",
            typeOfLayout: "fontFamily"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - letterSpacing - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "100",
            valueType: "%",
            typeOfLayout: "letterSpacing"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - backgroundColor & textColor - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "#ffffff",
            valueType: "",
            typeOfLayout: "backgroundColor"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - accentColor - success', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: JSON.stringify({
                tailwindFormat: 'purple',
                hexFormat: '#A855F7',
              }),
            valueType: "",
            typeOfLayout: "accentColor"
        })
            .expect(200);
    });

    it('PUT /api/v1/helper/users/layout - fontSize - failure - value too big', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "500",
            valueType: "px",
            typeOfLayout: "fontSize"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - lineHeight - failure - value too small', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "50",
            valueType: "%",
            typeOfLayout: "lineHeight"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - fontFamily - failure - wrong valueType', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "Overpass",
            valueType: "wrong",
            typeOfLayout: "fontFamily"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - backgroundColor & textColor - failure - value needs to be bigger than 0', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "",
            valueType: "",
            typeOfLayout: "backgroundColor"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - accentColor - failure - not a hex format', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: JSON.stringify({
                tailwindFormat: 'wrong',
                hexFormat: 'wrong',
              }),
            valueType: "",
            typeOfLayout: "accentColor"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - failure - wrong type of layout', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            value: "nothing",
            valueType: "",
            typeOfLayout: "wrong"
        })
            .expect(422);
    });

    it('PUT /api/v1/helper/users/layout - failure - session has expired', async () => {
        const { statusCode } = await request(mockApp).put('/api/v1/helper/users/layout').send({
            value: "",
            valueType: "",
            typeOfLayout: ""
        });
        expect(statusCode).toBe(401);
    });

    it('PUT /api/v1/helper/users/layout - failure - no value given', async () => {
        await authenticatedSession.put('/api/v1/helper/users/layout').send({
            valueType: "",
            typeOfLayout: ""
        })
            .expect(400);
    });

});


afterAll(async () => {
    await User.deleteMany({});
    closeConnection();
});