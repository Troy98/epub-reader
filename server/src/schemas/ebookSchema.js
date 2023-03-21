const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const fs = require('fs');
const base64ImageToFile = require('base64image-to-file');

const eBookPath = 'static/ebooks/';


const ebookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Titel is verplicht"]
    },
    author: {
        type: String,
        required: [true, "Auteur is verplicht"]
    },
    coverUrl: {
        type: String,
        required: [true, "Afbeelding is verplicht"]
    },
    scrollPosition: {
        type: Number,
        required: [true, "ScrollPositie is verplicht"],
        default: 0,
    },
    path: {
        type: String,
        required: [true, "Pad is verplicht"],
    }
});


ebookSchema.methods.saveEBook = (userId, EBookName, ebook) => {
    if (!fs
      .existsSync(`${eBookPath}${userId}`)) {
        fs.mkdirSync(`${eBookPath}${userId}`, { recursive: true });
    }

    ebook.mv(`${eBookPath}${userId}/${EBookName}/${ebook.name}`, (err) => {
        if (err) {
            console.log(err + " " + err.message);
            const error = new Error('Something went wrong while uploading the file');
            error.status = 500;
            throw error;
        }
    });
};

ebookSchema.methods.convertCover = async (userId, bookName, bookData) => {
    let coverPath = undefined;
    if (bookData.base64Cover && bookData.base64Cover.length > 0) {
        const path = `${eBookPath}${userId}/${bookName}`;
        coverPath = await new Promise((resolve, reject) => {
            base64ImageToFile(bookData.base64Cover, path, function (err, imgPath) {
                if (err) {
                    const error = new Error("Fout met uploaden van de afbeelding");
                    error.status = 500;
                    reject(error);
                }
                resolve(imgPath);
            });
        });
    }
    return coverPath;
}


ebookSchema.methods.saveCover

module.exports = ebookSchema;