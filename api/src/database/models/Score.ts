import mongoose, { Schema } from 'mongoose';
import UserModel from './User';
import RoomModel from './Room';
import { Score } from '../types/Score';

const scoreSchema = new Schema({
  videoId: String,
  clicker: { type: Schema.Types.ObjectId, ref: UserModel },
  clicks: Number,
  room: { type: Schema.Types.ObjectId, ref: RoomModel },
  evaluation: Array,
});

export default mongoose.model<Score>('Score', scoreSchema);
