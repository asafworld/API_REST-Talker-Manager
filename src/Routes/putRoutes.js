const express = require('express');
const { checkToken,
  checkName, checkAge, checkTalk, fileReader, fileWriter } = require('../helpers');

const router = express.Router();

router.put('/:id', checkToken, checkName, checkAge, checkTalk, async (req, res) => {
  const id = Number(req.params.id);
  const { body } = req;
  const listFile = await fileReader();
  console.log(listFile[id], 'ANTES');
  const addedObj = { id, ...body };
  listFile.forEach((tal) => {
    if (tal.id === Number(id)) {
      listFile[id] = addedObj;
    }
  });
  console.log(listFile[id], 'DEPOIS');
  const newList = JSON.stringify(listFile);
  await fileWriter(newList);
  return res.status(200).json(addedObj);
});

module.exports = router;