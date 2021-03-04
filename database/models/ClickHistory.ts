import mongoose, { Schema } from 'mongoose';

import { Document } from 'mongoose';
import { User } from './User';

export interface Click {
  time: number;
  type: boolean;
}

export interface ClickHistory extends Document {
  videoId: string;
  clicker: User['_id'];
  clicks: Array<Click>;
}

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
