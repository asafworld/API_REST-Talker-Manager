const express = require('express');
const { checkToken,
checkName, checkAge, checkTalk, fileWriter, fileReader } = require('../helpers');

const router = express.Router();

router.post('/', checkToken, checkName, checkAge, checkTalk, async (req, res) => {
  const { body } = req;
  const listFile = await fileReader();
  const id = listFile.length + 1;
  const addedObj = { id, ...body };
  listFile.push(addedObj);
  const newList = JSON.stringify(listFile);
  fileWriter(newList);
  return res.status(201).json(addedObj);
});

module.exports = router;