import ePub from 'epubjs';

const serverURL = process.env.REACT_APP_API_URL;

function blobToBase64(blob) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// return the title, author and coverURL form epub file
const returnResponseBody = async (EBook) => {
  const book = ePub(EBook);

  // Get the book content
  const bookContent = await book.loaded.metadata;
  const { title } = bookContent;
  const author = bookContent.creator;

  // Get the cover image
  const coverURL = await book.coverUrl();

  // Get the cover image as a blob
  const response = await fetch(coverURL);
  const responseToBlob = await response.blob();
  const base64Cover = await blobToBase64(responseToBlob);

  return {
    title,
    author,
    base64Cover,
  };
};

// upload the EBook
const uploadEBook = async (EBook, ok, err, final) => {
  const formData = new FormData();
  formData.append('file', EBook);

  const data = await returnResponseBody(EBook);
  formData.append('data', JSON.stringify(data));

  const options = {
    method: 'POST',
    body: formData,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${serverURL}/api/v1/helper/books`, options);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    return ok();
  } catch (er) {
    return err(er);
  } finally {
    final();
  }
};

export default uploadEBook;
