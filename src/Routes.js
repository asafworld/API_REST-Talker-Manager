const express = require('express');
const fileReader = require('./helpers');
// const talkersFile = require('./talker.json');
// const app = require('./index');

const router = express.Router();

router.get('/', async (_req, res) => {
    const talkersArr = await fileReader();
    console.log(talkersArr);
    return res.status(200).json(talkersArr);
});

module.exports = router;