const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      min: 6,
      max: 12,
      unique: true,
    },
    mail: {
      type: String,
      required: true,
      min: 6,
      max: 128,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 12,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role:{
      type: String,
    }
  });
  
  const User = mongoose.model('users', userSchema);
  
  module.exports = User;