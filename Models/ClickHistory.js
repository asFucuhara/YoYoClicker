const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clickHistorySchema = new Schema({
  videoId: String,
  clicker: { type: Schema.Types.ObjectId, ref: 'User' },
  clicks: [
    {
      time: Number,
      type: { type: Boolean },
    },
  ],
});

mongoose.model('ClickHistory', clickHistorySchema);
