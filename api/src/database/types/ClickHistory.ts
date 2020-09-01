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
