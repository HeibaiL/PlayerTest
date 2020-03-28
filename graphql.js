const { buildSchema } = require("graphql");
const videoSchema = require("./models/videoChema");

const schema = buildSchema(`
type Video {
  id:ID!
  ref:String!
  date:String!
  currentTime:Float
  title:String!
}

input VideoInput{
  ref:String!
  date:String!
  currentTime:Float!
  title:String!
}

type RootQuery {
    video: [Video!]

}
type RootMutation {
    addVideo(videoInput:VideoInput):[Video!]!
}
schema {
    query: RootQuery
    mutation:RootMutation
}
`);

const addVideoResolver = async (args, req) => {
  const videoExist = await videoSchema.findOne({
    title: args.videoInput.title
  });

  if (videoExist) {
    await videoSchema.updateOne(
      { title: args.videoInput.title },
      { ...args.videoInput }
    );
    return await videoSchema.find();
  }

  video = new videoSchema({
    ref: args.videoInput.ref,
    title: args.videoInput.title,
    date: new Date(args.videoInput.date),
    currentTime: args.videoInput.currentTime
  });
  await video.save();
  return await videoSchema.find();
};

const videoResolver = async () => {
  return await videoSchema.find();
};

module.exports = { schema, addVideoResolver, videoResolver };
