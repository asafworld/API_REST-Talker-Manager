const express = require('express');
const { fileReader, checkToken } = require('../helpers');

const router = express.Router();

router.get('/search', checkToken, async (req, res) => {
  const { q } = req.query;
  console.log(q);
  const list = await fileReader();
  if (q === '' || q === undefined) {
    const parsedList = JSON.parse(list);
    return res.status(200).json(parsedList);
  }
  const filteredList = list.filter((tal) => tal.name.includes(q));
  return res.status(200).json(filteredList);
});

module.exports = router;