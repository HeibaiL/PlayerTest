const { buildSchema } = require("graphql");
const videoSchema = require("./models/videoChema");
const userSchema = require("./models/userSchema.js");
const viewerSchema = require("./models/viewerSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = buildSchema(`
type User {
  email:String!
  password:String!
  firstName:String!
  secondName:String!
}

type currentViewer{
  userId:ID!
}

type Video {
  id:ID!
  ref:String!
  date:String!
  currentTime:Float
  title:String!
}

input UserInput{
  email:String!
  password:String!
  firstName:String!
  secondName:String!
}

input VideoInput{
  ref:String!
  date:String!
  currentTime:Float!
  title:String!
}

type AuthData {
  userId:ID!
  token:String!
  tokenExpiration:Int!
}

type RootQuery {
    video: [Video!]
    loginIn(email:String!, password:String!):AuthData!
    viewer: currentViewer!

}

type RootMutation {
    addVideo(videoInput:VideoInput):[Video!]!
    signUp(userInput:UserInput):User!
    setViewer(token:String!):currentViewer!
    deleteViewer(token:String!):currentViewer
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

const signUpResolver = async args => {
  const { email, password, firstName, secondName } = args.userInput;
  const userExist = await userSchema.findOne({ email });
  if (userExist) throw new Error("This email is already taken");
  
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new userSchema({
    email,
    password: hashedPassword,
    firstName,
    secondName
  });
  await user.save();
  return user;
};

const loginResolver = async ({ email, password }) => {
  const user = await userSchema.findOne({ email });
  if (!user) throw new Error("User does not exist");
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) throw new Error("Password is incorrect");
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_WORD,
    {
      expiresIn: "2h"
    }
  );
  return { userId: user.id, token, tokenExpiration: 2 };
};

const setViewerResolver = async ({ token }) => {
  const decoded = jwt.verify(token, process.env.SECRET_WORD);
  if (!decoded) throw new Error("Unauthorized");
  const currentlyWatched = new viewerSchema({ userId: decoded.id });
  await currentlyWatched.save();
  return { userId: decoded.id };
};
const viewerResolver = async () => {
  const viewer = await viewerSchema.find();
  if (viewer.length === 0) throw new Error("No one is currently watching");
  const userId = viewer[0].userId;

  return { userId };
};

const deleteViewerResolver = async ({ token }) => {
  const decoded = jwt.verify(token, process.env.SECRET_WORD);
  if (!decoded) throw new Error("Unauthorized");
  const viewer = await viewerSchema.find();
  const userId = viewer[0].userId;
  const isViewer = decoded.id == userId;

  if (isViewer) {
    await viewerSchema.deleteOne({ userId });
  }
  return { userId };
};

module.exports = {
  schema,
  addVideoResolver,
  videoResolver,
  signUpResolver,
  loginResolver,
  setViewerResolver,
  viewerResolver,
  deleteViewerResolver
};
