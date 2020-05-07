const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  videoId: String,
  clicker: { type: Schema.Types.ObjectId, ref: 'User' },
  clicks: Number,
  coreografia: Number,
  diversidade: Number,
  controle: Number,
  execucao: Number,
});

mongoose.model('Score', scoreSchema);
