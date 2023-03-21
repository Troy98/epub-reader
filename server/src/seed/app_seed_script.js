const user = require('../models/user');

const seed = async () => {

  const userExist = await user.find({username: 'testuser'});

  if (!userExist.length) {
    await user.create({
      username: 'testuser',
      ebooks: [{
        title: 'Alice\'s Adventures in Wonderland',
        author: 'Lewis Carroll',
        coverUrl: 'static/e2e/aaiw/aaiw_test_cover_url.jpeg',
        path: 'static/e2e/aaiw/aaiw_test_book.epub',
      },
        {
          title: 'Queens Cadet',
          author: 'James Grant',
          coverUrl: 'static/e2e/queens_cadet/queenscadetcover.jpeg',
          path: 'static/e2e/queens_cadet/queens_cadet.epub',
        }
      ]
    })
  }
}

const runSeed = async () => {
  try {
    await seed();
  } catch (err) {
    console.log(err)
  }
}

module.exports = runSeed;
