const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());


app.use("/", (req, res) => {
  res.send("Server is up and running");
});

app.use(
  "/graphql",
  graphqlHttp({
    schema:buildSchema(`
    type RootQuery {
        videos: [String!]!
    
    }
    type RootMutation {
    
    }
    schema {
        query: RootQuery
        mutation:RootMutation
    }
    `),
    rootValue: {},
    graphiql: true
  })
);

app.listen(4000);
