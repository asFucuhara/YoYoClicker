import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

import UserModel from './User';
import RoomModel from './Room';
import { User } from './User';
import { Room } from './Room';

export interface Score extends Document {
  videoId: string;
  clicker: User['_id'];
  clicks: Number;
  room: Room['_id'];
  evaluation: Array<string>;
}

const scoreSchema = new Schema({
  videoId: String,
  clicker: { type: Schema.Types.ObjectId, ref: UserModel },
  clicks: Number,
  room: { type: Schema.Types.ObjectId, ref: RoomModel },
  evaluation: Array,
});

export default mongoose.model<Score>('Score', scoreSchema);
