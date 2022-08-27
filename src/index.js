const express = require('express');
const bodyParser = require('body-parser');
const getRouter = require('./Routes/getRoutes');
const loginRouter = require('./Routes/postLogin');
const postRouter = require('./Routes/postRoutes');
const putRouter = require('./Routes/putRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/talker', getRouter);
app.use('/login', loginRouter);
app.use('/talker', postRouter);
app.use('/talker', putRouter);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

module.exports = app;