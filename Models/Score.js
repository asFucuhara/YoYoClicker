const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  url: String,
  clicker: { type: Schema.Types.ObjectId, ref: 'User' },
  clicks: [
    {
      time: Number,
      type: { type: Boolean },
    },
  ],
});

mongoose.model('Score', scoreSchema);
