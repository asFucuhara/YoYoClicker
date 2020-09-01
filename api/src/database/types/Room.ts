import { Document } from 'mongoose';
import { User } from './User';

export interface Room extends Document {
  name: string;
  desc?: string;
  admins?: Array<User['_id']>;
  judges?: Array<User['_id']>;
  guests?: Array<User['_id']>;
  owner: User['_id'];
  scoreParams: Array<String>;
}
