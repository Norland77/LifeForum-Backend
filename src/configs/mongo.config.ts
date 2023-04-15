import "dotenv/config";

export default {
  uri: process.env.MONGO_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
  },
};  