const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");

const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const {
  schema,
  videoResolver,
  addVideoResolver,
  signUpResolver,
  loginResolver,
  setViewerResolver,
  viewerResolver,
  deleteViewerResolver
} = require("./graphql");
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
      addVideo: addVideoResolver,
      signUp: signUpResolver,
      loginIn: loginResolver,
      setViewer:setViewerResolver,
      viewer:viewerResolver,
      deleteViewer:deleteViewerResolver
    },
    graphiql: true
  })
);

mongoose
  .connect(
    "mongodb+srv://John:" +
      process.env.DB_PASSWORD +
      "@testcluster-itxrr.mongodb.net/player?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connected to db"));
app.listen(PORT, () => console.log("Server is running on port", PORT));
