const express = require('express');
const routes = require('./routes');
const graphqlServer = require('./graphql');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json())
app.use(routes);

app.listen(PORT, err => {
  if(err){
    console.log(`Não foi possível iniciar servidor na porta ${PORT}`);
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}`);
  }
})

graphqlServer.applyMiddleware({ app });