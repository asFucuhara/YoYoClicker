import mongoose, { Schema } from 'mongoose';
import { User } from '../types/User';

const userSchema = new Schema({
  name: String,
  email: String,
  img: String,
  code: Number,
  isAdmin: Boolean,
  isJudge: Boolean,
});

export default mongoose.model<User>('User', userSchema);
