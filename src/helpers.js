const fs = require('fs').promises;

const fileReader = async () => {
  const path = './src/talker.json';  
  const talkerObj = await fs.readFile(path);
  const parsedObj = JSON.parse(talkerObj);
  return parsedObj;
};

module.exports = fileReader;