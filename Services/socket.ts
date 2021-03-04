import socketIo, { Socket } from 'socket.io';
import socketIoAuth from 'socketio-auth';

import userModel from '../database/models/User';
import scoreModel from '../database/models/Score';
import roomModel from '../database/models/Room';

import { Server } from 'http';

// const userModel = mongoose.model('User');
// const scoreModel = mongoose.model('Score');
// const clickHistoryModel = mongoose.model('ClickHistory');

interface AuthData {
  isNew: boolean;
  email: string;
  name: string;
  code: string;
}

interface SocketPlus extends Socket {
  clientId?: string;
}

interface Clicker {
  id: string;
  img: string;
  name: string;
  positive: number;
  negative: number;
}

function getRoom(socket: SocketPlus) {
  console.log('rooms:', socket.rooms, socket.id);
  const filteredRooms = Object.keys(socket.rooms).filter(
    (key) => key !== socket.id
  );

  //for now return just first room
  return filteredRooms[0];
}

module.exports = (server: Server) => {
  const io = socketIo(server);

  //todo room implementation
  //todo variable room rules(clicks + eval) implementation
  //todo clickerList = {id:{ id: _id, img, name, positive: 0, negative: 0 }, list:[ids...]}
  let clickerList = [] as Array<Clicker>;
  let isPlaying = false;

  //socket authentication
  socketIoAuth(io, {
    authenticate: async (socket: SocketPlus, data: AuthData, callback) => {
      //todo if playing display to user and make it wait for next video
      //todo declutter leave only authentication process here, move anything else to on conected
      //! remove sign up for mvp
      const { isNew } = data;
      if (isNew) {
        //create user
        const { email, name } = data;
        //checking if email is on server
        const user = await userModel.findOne({ email });
        if (!user) {
          //new user
          //generating 5 number code for authentication
          const code = Math.floor(Math.random() * 99999);
          const newUser = new userModel({ email, name, code });
          try {
            await newUser.save();
            const { _id, img, name } = newUser;
            const newClicker = { id: _id, img, name, positive: 0, negative: 0 };
            socket.clientId = _id;
            clickerList.push(newClicker);
            socket.broadcast.emit('newClicker', newClicker);
            callback(undefined, { id: newUser._id, clickerList, code });
          } catch (e) {
            //todo check //callback(e);
            callback(new Error(e));
          }
        } else {
          //alredy exist
          callback(new Error('Email já cadastrado'));
        }
      } else {
        //authenticate
        const { email, code } = data;
        const user = await userModel.findOne({ email });
        if (user) {
          const { _id, img, name, isAdmin } = user;
          if (!isAdmin) {
            const newClicker = { id: _id, img, name, positive: 0, negative: 0 };
            socket.clientId = _id;
            clickerList.push(newClicker);
            socket.broadcast.emit('newClicker', newClicker);
          }
          callback(undefined, { id: user._id, isAdmin, clickerList });
        } else {
          callback(new Error('Código invalido'));
        }
      }
    },
    postAuthenticate: (socket, data) => {},
    disconnect: () => {},
  });

  //todo change socket to be Socket + clientId and Room
  io.on('connection', (socket: SocketPlus) => {
    console.log(`New client connected`);
    //todo remove
    socket.join('test');

    socket.on('disconnect', () => {
      //todo clickerList = [{id: _id, img, name, positive: 0, negative: 0 }]
      clickerList = clickerList.filter(
        (clickerObject) => socket.clientId !== clickerObject.id
      );
      socket.broadcast
        .to(getRoom(socket))
        .emit('removeClicker', { id: socket.clientId });
      console.log('Client disconnected');
    });

    //todo joinRoom()
    //todo change for dynamic aproach
    //  const room = 'staticRoom';
    //  socket.join(room);
    //  //?todo maybe change to handle everything with socket.rooms.forEach() | maybe not necessary since the user wiil only be connect to 1 socket at a time
    //  socket.room = room;

    //clicked(positive or negative) || clicked(update score)
    socket.on('clicked', (data) => {
      //broadcast
      socket.broadcast.to(getRoom(socket)).emit('clicked', data);
    });

    socket.on('getClickerList', (data) => {
      //broadcast
      socket.emit('clickerList', clickerList);
    });

    socket.on('save', async (data) => {
      console.log(data);
      const score = new scoreModel(data);
      console.log(score);
      await score.save();
      socket.emit('saved');
      socket.broadcast.to(getRoom(socket)).emit('syncClick', {
        id: socket.clientId,
        positive: 0,
        negative: 0,
      });
    });

    socket.on('videoEnded', async (data) => {
      //save summary of clicks
      //save as user ended
      //todo when ever user ended give ok for admin change video
      // const clickHistory = new clickHistoryModel(data);
      // await clickHistory.save();
      socket.emit('clickHistorySaved');
    });

    //Admin controls
    socket.on('videoChange', (data) => {
      console.log('videoChange');
      //todo:check if admin
      //todo:check if video can change
      //change state to paused
      isPlaying = false;
      //broadcast video change
      io.in(getRoom(socket)).emit('videoChange', data);
    });

    socket.on('videoStart', () => {
      console.log('videoStart');
      //todo:check admin
      //todo:chack if can start
      //change state to playing
      isPlaying = true;
      //broadcast
      io.in(getRoom(socket)).emit('videoStart');
    });

    socket.on('videoPause', () => {
      console.log('videoPause');
      //todo:check admin
      //todo:chack if can start
      //broadcast
      io.in(getRoom(socket)).emit('videoPause');
    });

    socket.on('videoRestart', () => {
      console.log('videoRestart');
      //todo:check admin
      //todo:chack if can start
      //change state to playing
      isPlaying = true;
      //broadcast
      io.in(getRoom(socket)).emit('videoRestart');
    });

    socket.on('forceFinishVideo', () => {
      //check admin
      //broadcast message
    });
  });
  return io;
};
