import { Document } from 'mongoose';
import { User } from './User';
import { Room } from './Room';

export interface Score extends Document {
  videoId: string;
  clicker: User['_id'];
  clicks: Number;
  room: Room['_id'];
  evaluation: Array<string>;
}
