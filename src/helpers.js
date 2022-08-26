const fs = require('fs').promises;
const crypto = require('crypto');

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

const isEmailValid = (req, res, next) => {
  const { email } = req.body;
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(validRegex)) {
    return next();
  }
  return res.status(400).json({
    message: 'O "email" deve ter o formato "email@email.com"',
  });
};
// Validation based on this web article: https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript

const isPasswordValid = (req, res, next) => {
  const { password } = req.body;
  const pwArr = password.split('');
  if (pwArr.length >= 6) {
    return next();
  }
  return res.status(400).json({
    message: 'O "password" deve ter pelo menos 6 caracteres',
  });
};

const isUserEmpty = (req, res, next) => {
  const { email, password } = req.body;
  if (email === undefined) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  } 
  if (password === undefined) {
    return res.status(400).json({
      message: 'O campo "password" é obrigatório',
    });
  }
  return next();
};

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = {
  fileReader,
  findTalker,
  isEmailValid,
  isPasswordValid,
  isUserEmpty,
  generateToken,
};