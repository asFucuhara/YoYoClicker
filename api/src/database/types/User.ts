import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  img: string;
  code?: number;
  isAdmin?: boolean;
  isJudge?: boolean;
}
