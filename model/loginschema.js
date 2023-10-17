const mongoose = require("mongoose")


const signupschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false
  },
});

const signupcollection = new mongoose.model('signupcollection', signupschema)

module.exports = signupcollection 