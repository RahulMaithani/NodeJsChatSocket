const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({

  phoneNumber1: {
    type: String,
    required: "phoneNumber1 is required",
    minlength: 10,
    maxlength: 15,

  },
  phoneNumber2: {
    type: String,
    required: "phoneNumber2 is required",
    minlength: 10,
    maxlength: 15,

  }
});

module.exports = mongoose.model("Chat", chatSchema);
