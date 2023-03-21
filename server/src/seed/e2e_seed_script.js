const user = require('../models/user');

const seed = async () => {

    await user.deleteMany({});

    await user.create({
        username: 'testuser',
        ebooks:
        {
            title: 'testbook',
            author: 'testauthor',
            coverUrl: 'static/e2e/aaiw/aaiw_test_cover_url.jpeg',
            path: 'static/e2e/aaiw/aaiw_test_book.epub',
        }
    })

    await user.create({ username: 'newuser' });

    await user.create({
        username: 'testusertwobooks',
        ebooks: [{
            title: 'testbook',
            author: 'testauthor',
            coverUrl: 'static/e2e/aaiw/aaiw_test_cover_url.jpeg',
            path: 'static/e2e/aaiw/aaiw_test_book.epub',
        },
            {
                title: 'queens cadet',
                author: 'testauthor',
                coverUrl: 'static/e2e/queens_cadet/queenscadetcover.jpeg',
                path: 'static/e2e/queens_cadet/queens_cadet.epub',
            }
        ]
    });
}

const runSeed = async () => {
    try {
        await seed();
    } catch (err) {
        console.log(err)
    }
}

module.exports = runSeed;
