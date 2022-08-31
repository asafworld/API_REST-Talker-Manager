# TALKER MANAGER

##### Projeto desenvolvido por Gabriel Asaf durante o curso de Back-End da Trybe. 
##### API REST destinada a gerência de dados (CRUD) dos palestrantes de um evento.

# ÍNDICE

<!--ts-->
   * [Organização do Repositório](#organização-do-repositório)
      * [Arquivos](#arquivos)
   * [Endpoints](#endpoints)
   * [Funções Helpers](#funções-helpers)
   * [Instalação](#instalacao)
   * [Como usar](#como-usar)
<!--te-->

# ORGANIZAÇÃO DO REPOSITÓRIO: 

Todos os arquivos importantes para o desempenho da aplicação se encontram na pasta "src".

## ARQUIVOS:

server.js -> Aqui todas as rotas criadas são recebidas e conectadas a aplicação. Nele, também é definido o servidor que irá veicular todas as requisições HTTP. 

helpers.js -> Todas os middlewares e funções de verificação de dados estão guardadas neste arquivo.

Arquivos de rotas (ex.: getRoutes.js) -> Cada arquivo é nomeado segundo as rotas que contém. Todas as requisições daquele tipo, destinadas ao endpoint base (ex.: talker), estão contidas dentro de cada um destes arquivos. 

talker.json -> Arquivo JSON fonte com as informações gerenciadas.

# ENDPOINTS

#### /talker
MÉTODO GET -> Retorna todas as informações da API.
MÉTODO POST -> Adiciona o objeto de um novo palestrante.

O objeto deve conter:
```
{
    "name": "Henrique Albuquerque",
    "age": 62,
    "id": 1,
    "talk": {
      "watchedAt": "23/10/2020",
      "rate": 5
    }
  }
```

#### /talker/:id
MÉTODO GET -> Retorna o objeto de um palestrante de id específico.
MÉTODO PUT -> Edita um palestrante de id específico. Requer no corpo de sua requisição um objeto contendo os campos do objeto referenciado no endpoint acima.
MÉTODO DELETE -> Deleta um palestrante de id específico.

#### /login
Retorna um objeto de chave única denominada "Token", que possui o Token de autorização para adição, edição e exclusão de dados.

O objeto recebido no corpo da requisição, deve possuir email e senha:
```
{
   "login": "email@email.com",
   "password": 123456,
}
```

# FUNÇÕES HELPERS

#### fileReader()
```
const fileReader = async () => {
  const path = './src/talker.json';  
  const talkerObj = await fs.readFile(path);
  const parsedObj = JSON.parse(talkerObj);
  return parsedObj;
};
```
O arquivo usufrui do módulo *fs*. É destinado a ler o arquivo fonte JSON, converter suas informações para JavaScript. Retorna um objeto com todas as informações do arquivo talker.json.

#### fileWriter(newFile)
```
const fileWriter = async (newFile) => {
  const path = './src/talker.json';  
  try {
    await fs.writeFile(path, newFile);
  } catch (err) {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  }
};
```
O arquivo usufrui do módulo *fs*. Recebe um objeto JavaScript com informações atualizadas na lista de palestrantes (já convertida pela função JSON.stringfy) e altera o arquivo talker.json.

#### findTalker(id)
```
const findTalker = async (id) => {
  const talkerObj = await fileReader();
  const talker = talkerObj.find((tal) => tal.id === id);
  return talker;
};
```
A função recebe um ID numérico, executa a função (descrita acima) *fileReader()* e logo em seguida utiliza da HOF *find* para encontrar o palestrante de id equivalente. Retorna um objeto com as informações do palestrante.

#### isEmailValid(req, res, next) e isPasswordValid (req, res, next)
```
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
```
Middlewares de verificação de email e senha. As validações se dão de acordo com parâmetros Regex (referenciado no código) e mínimo de 6 dígitos, respectivamente. Caso retorno válido nas validações, permitem o prosseguimento da requisição, no contrário, retornam uma mensagem de erro e **status 400**.

#### isUserEmpty(req, res, next)
```
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
```
Middleware de verificação dos campos email e senha. Verifica se algum dos campos está vazio. Caso haja um retorno válido, permite o prosseguimento da requição para os seguintes middlewares, no contrário, retorna a respectiva mensagem de erro e **status 400**.

#### generateToken()
```
const generatedToken = { token: '' };
const generateToken = () => {
  const token = crypto.randomBytes(8).toString('hex');
  generatedToken.token = token;
  return token;
};
```
Função que gera o token de autorização após o login. O token gerado é guardado no objeto JS *generatedToken*.

#### checkToken(req, res, next)
```
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
```
Middleware de verificação do token de autorização. Caso não esteja presente na requisição ou seja um token inválido, retorna uma mensagem de erro e **status 401**.

### Middlewares de verificação de dados
```
checkName()

checkAge()
```
Verificações das chaves "name" e "age".

```
checkTalkWatchedAt()

checkTalkRate()

checkTalkField()

checkTalk()
```
Verificações do objeto "Talk" e suas chaves "WatchedAt" e "Rate". O middleware checkTalk() chama cada uma das funções específicas e caso todas retornem um resultado válido, permite que requisição prossiga. Cada uma das funções possui um mensagem de retorno e **status 400**.

# INSTALAÇÃO: 

Ao clonar o projeto, realize o NPM INSTALL em seu terminal antes de utilizar a aplicação. 
O projeto irá falhar caso isso não seja feito.

```
npm install
```

# COMO USAR

Excute a aplicação com NPM START e faça as requisições via NAVEGADOR (pela URL) ou execute os endpoints via Thunder em seu VSCode.
____________________________________________________________________________

Project developed by Gabriel Asaf throughout Trybe's Back-end course.

