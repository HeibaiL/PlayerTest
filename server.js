const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const PORT = process.env.PORT || 4000;

const app = express();

const videoData = [
  "https://www.youtube.com/watch?v=LXTyzk2uud0&list=WL&index=7&t=979s",
  "https://www.youtube.com/watch?v=-1h8HQ6rd5U&t=2s"
];

const schema = buildSchema(`
type RootQuery {
    videos: [String!]!

}
type RootMutation {
    addVideo(ref:String):[String!]!
}
schema {
    query: RootQuery
    mutation:RootMutation

}
`);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: {
      videos: () => {
        return videoData;
      },
      addVideo: args => {
         videoData.push(args.ref);
         return videoData
      }
    },
    graphiql: true
  })
);

app.listen(PORT, () => console.log("Server is running on port", PORT));
