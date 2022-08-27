const express = require('express');
const { isEmailValid, isPasswordValid, isUserEmpty, generateToken } = require('../helpers');
// const tokenFile = require('../token/token.json');

const router = express.Router();

router.post('/', isUserEmpty, isEmailValid, isPasswordValid, (_req, res) => {
  const token = generateToken();
  // tokenFile.token = JSON.stringify(token);
  return res.status(200).json({
    token,
  });
});

module.exports = router;