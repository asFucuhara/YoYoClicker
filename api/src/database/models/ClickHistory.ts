import mongoose, { Schema } from 'mongoose';
import { ClickHistory } from '../types/ClickHistory';

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

export default mongoose.model<ClickHistory>('ClickHistory', clickHistorySchema);
