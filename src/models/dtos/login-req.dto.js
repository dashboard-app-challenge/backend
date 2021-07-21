var mongoose = require("mongoose");

const loginReqDto = mongoose.Schema({
  username: {
    type: String,
    maxlength: 15,
  },
  pass: {
    type: String,
    required: true,
    maxlength: 60,
    minlength: 6,
  },
  email: {
    type: String,
    maxlength: 60,
  },
});

module.exports = mongoose.model("LoginReqDto", loginReqDto);
