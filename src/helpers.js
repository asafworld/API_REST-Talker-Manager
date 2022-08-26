const fs = require('fs').promises;

const fileReader = async () => {
  const path = './src/talker.json';  
  const talkerObj = await fs.readFile(path);
  const parsedObj = JSON.parse(talkerObj);
  return parsedObj;
};

const findTalker = async (id) => {
  const talkerObj = await fileReader();
  const talker = talkerObj.find((tal) => tal.id === id);
  return talker;
};

module.exports = {
  fileReader,
  findTalker,
};