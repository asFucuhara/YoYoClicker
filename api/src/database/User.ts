import UserModel from './models/User';
import { User } from './types/User';

export interface UserCreateObject {
  name: string;
  email: string;
  img: string;
}

export interface UserUpdateObject {
  name?: string;
  email?: string;
  img?: string;
}

export async function index() {
  const users = await UserModel.find();
  return users;
}

export async function show(id: User['_id']) {
  const user = await UserModel.findById(id);
  return user;
}

export async function create(userCreateObject: UserCreateObject) {
  const user = await UserModel.create(userCreateObject);
  return user;
}

export async function update(id: User['_id'], userUpdateObject: UserUpdateObject) {
  const user = await UserModel.findByIdAndUpdate(id, userUpdateObject);
  return user;
}

export async function remove(id: User['_id']) {
  const user = await UserModel.findByIdAndDelete(id);
  return user;
}
