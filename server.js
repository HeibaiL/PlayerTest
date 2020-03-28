const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const { schema, videoResolver, addVideoResolver } = require("./graphql");
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: {
      video: videoResolver,
      addVideo: addVideoResolver
    },
    graphiql: true
  })
);

mongoose
  .connect(process.env.DB_CONNECTON_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to db"));
app.listen(PORT, () => console.log("Server is running on port", PORT));
