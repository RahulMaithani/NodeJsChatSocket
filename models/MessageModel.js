const mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: "chatId is required",
    minlength: 4,
    maclength: 150,
  },
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
  },
  status: {
    type: String,
    required: "status is required",
    minlength: 4,
    maxlength: 150,

  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  latitude: {
    type: SchemaTypes.Double,
  },
  longitude: {
    type: SchemaTypes.Double,
  },
});

module.exports = mongoose.model("Message", messageSchema);
