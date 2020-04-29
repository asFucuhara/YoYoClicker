const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  img: String,
  code: Number,
});

mongoose.model('User', userSchema);
