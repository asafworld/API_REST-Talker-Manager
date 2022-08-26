const express = require('express');
const { isEmailValid, isPasswordValid, isUserEmpty, generateToken } = require('../helpers');

const router = express.Router();

router.post('/', isUserEmpty, isEmailValid, isPasswordValid, (_req, res) => {
  const token = generateToken();
  return res.status(200).json({
    token,
  });
});

module.exports = router;