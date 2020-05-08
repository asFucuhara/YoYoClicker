const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  img: String,
  code: Number,
  isAdmin: Boolean,
  isJudge: Boolean,
});

mongoose.model('User', userSchema);
