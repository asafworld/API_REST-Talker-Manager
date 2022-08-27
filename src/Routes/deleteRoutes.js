const express = require('express');
const { checkToken,
  fileReader, fileWriter } = require('../helpers');

const router = express.Router();

router.delete('/:id', checkToken, async (req, res) => {
  const id = Number(req.params.id);
  const listFile = await fileReader();
  const updList = listFile.filter((tal) => tal.id !== id);
  const newList = JSON.stringify(updList);
  await fileWriter(newList);
  return res.status(204).end();
});

module.exports = router;