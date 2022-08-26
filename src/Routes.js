const express = require('express');
const { fileReader, findTalker } = require('./helpers');

const notFound = {
    message: 'Pessoa palestrante não encontrada',
  };

const router = express.Router();

router.get('/', async (_req, res) => {
    const talkersArr = await fileReader();
    console.log(talkersArr);
    return res.status(200).json(talkersArr);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const talker = await findTalker(id);
  if (talker !== undefined) {
    return res.status(200).json(talker);
  }
  return res.status(404).json(notFound);
});

module.exports = router;