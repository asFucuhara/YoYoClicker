import mongoose, { Schema } from 'mongoose';
import UserModel from './User';
import { Document } from 'mongoose';
import { User } from './User';

export interface Room extends Document {
  name: string;
  desc?: string;
  admins?: Array<User['_id']>;
  judges?: Array<User['_id']>;
  guests?: Array<User['_id']>;
  owner: User['_id'];
  evalScheme: Object;
}

const roomSchema = new Schema({
  name: String,
  desc: String,
  admins: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  judges: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  guests: [{ type: Schema.Types.ObjectId, ref: UserModel }],
  owner: { type: Schema.Types.ObjectId, ref: UserModel },
  evalScheme: Object,
});

export default mongoose.model<Room>('Room', roomSchema);
