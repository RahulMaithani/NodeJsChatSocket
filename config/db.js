//FILENAME : db.js

const mongoose = require("mongoose");
require('dotenv').config({path: __dirname + '/.env'})

// Replace this with your MONGOURI.

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
       useCreateIndex: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
