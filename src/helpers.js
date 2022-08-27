const fs = require('fs').promises;
const crypto = require('crypto');

const fileReader = async () => {
  const path = './src/talker.json';  
  const talkerObj = await fs.readFile(path);
  const parsedObj = JSON.parse(talkerObj);
  return parsedObj;
};

const fileWriter = async (newFile) => {
  const path = './src/talker.json';  
  try {
    await fs.writeFile(path, newFile);
  } catch (err) {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  }
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

const generatedToken = { token: '' };
const generateToken = () => {
  const token = crypto.randomBytes(8).toString('hex');
  generatedToken.token = token;
  return token;
};

const checkToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (authorization !== generatedToken.token) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  return next();
};

const checkName = (req, res, next) => {
  const { name } = req.body;
  if (name === '' || name === undefined) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  const nameArr = name.split('');
  if (nameArr.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  return next();
};

const checkAge = (req, res, next) => {
  const { age } = req.body;
  if (age === '' || age === undefined) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (age < 18) {
    return res.status(400).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }
  return next();
};

const checkTalkWatchedAt = (talk, res) => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  if (talk.watchedAt === undefined || talk.watchedAt === '') {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
  if (!talk.watchedAt.match(dateRegex)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  return true;
};

const checkTalkRate = (talk, res) => {
  if (talk.rate === undefined || talk.rate === '') {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  return true;
};

const checkTalkField = (talk, res) => {
  if (talk === '' || talk === undefined) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }
  return true;
};

const checkTalk = (req, res, next) => {
  const { talk } = req.body;
  const field = checkTalkField(talk, res);
  const watched = checkTalkWatchedAt(talk, res);
  const rate = checkTalkRate(talk, res);
  if (field === true && watched === true && rate === true) {
    return next();
  }
};
// Regex date from https://www.regextester.com/99555

module.exports = {
  fileReader,
  fileWriter,
  findTalker,
  isEmailValid,
  isPasswordValid,
  isUserEmpty,
  generateToken,
  // tokenReader,
  checkToken,
  checkName,
  checkAge,
  checkTalk,
};