const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: "senderId is required",
    minlength: 4,
    maclength: 150,
  },
  receiverId: {
    type: String,
    required: "receiverId is required",
    minlength: 4,
    maxlength: 150,

  },
  name: {
    type: String,
    required: "name is required",
    minlength: 4,
    maxlength: 150,

  },
  message: {
    type: String,
    required: "message is required",
  },
  status: {
    type: String,
    required: "status is required",
    minlength: 4,
    maxlength: 150,

  },
  createdAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Message", messageSchema);
