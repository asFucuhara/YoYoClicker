import RoomModel from './models/Room';
import { Room } from './types/Room';
import { User } from './types/User';

export interface RoomCreateObject {
  name: string;
  desc?: string;
  admins?: Array<User['_id']>;
  judges?: Array<User['_id']>;
  guests?: Array<User['_id']>;
  owner: User['_id'];
  scoreParams: Array<String>;
}

export interface RoomUpdateObject {
  name?: string;
  desc?: string;
  admins?: Array<User['_id']>;
  judges?: Array<User['_id']>;
  guests?: Array<User['_id']>;
  owner?: User['_id'];
  scoreParams?: Array<String>;
}

export async function index() {
  const rooms = await RoomModel.find();
  return rooms;
}

export async function show(id: Room['_id']) {
  const room = await RoomModel.findById(id);
  return room;
}

export async function create(roomCreateObject: RoomCreateObject) {
  const room = await RoomModel.create(roomCreateObject);
  return room;
}

export async function update(id: Room['_id'], roomUpdateObject: RoomUpdateObject) {
  const room = await RoomModel.findByIdAndUpdate(id, roomUpdateObject);
  return room;
}

//todo addGuest() addJudges() addGuest()

export async function remove(id: Room['_id']) {
  const room = await RoomModel.findByIdAndDelete(id);
  return room;
}
