const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const fs = require('fs');
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'));
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const typeDefs = gql`${schema}`;

const graphqlServer = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: ({ req }) => {
    if(req.headers && req.headers.authorization) {
      const [,token] = req.headers.authorization.split(' ');
      try {
        const payload = jwt.verify(token, process.env.SERVER_SECRET);
        
        return {
          user: payload.user
        }
      } catch(error) { }

      return { };
    }
  }
})

module.exports = graphqlServer;