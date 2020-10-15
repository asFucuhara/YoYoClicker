import mongoose, { Schema } from 'mongoose';
import UserModel from './User';
import { Room } from '../types/Room';

const roomSchema = new Schema({
  name: String,
  desc: String,
  admins: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  judges: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  guests: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  owner: { type: Schema.Types.ObjectId, ref: UserModel },
  scoreParams: [String],
  //queue:[],
});

export default mongoose.model<Room>('Room', roomSchema);
