const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "name is required",
    minlength: 4,
    maxlength: 150,

  },
  imageString: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: "phoneNumber is required",
    minlength: 4,
    maxlength: 150,

  }
});

module.exports = mongoose.model("User", userSchema);
