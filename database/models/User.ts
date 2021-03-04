import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  img: string;
  code?: number;
  isAdmin?: boolean;
  isJudge?: boolean;
}

const userSchema = new Schema({
  name: String,
  email: String,
  img: String,
  code: Number,
  isAdmin: Boolean,
  isJudge: Boolean,
});

export default mongoose.model<User>('User', userSchema);
