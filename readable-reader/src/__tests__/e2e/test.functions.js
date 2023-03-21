const localStorageData = async page => {
  const result = await page.evaluate(() => {
    let json = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      json[key] = localStorage.getItem(key);
    }
    return json;
  });

  return result;
};

module.exports = {
  localStorageData,
};