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

interface SaveData {
  evaluation: { [key: string]: number | string };
  clicks: number;
  clicker: string;
  videoId: string;
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
  const filteredRooms = Object.keys(socket.rooms).filter(
    (key) => key !== socket.id
  );

  //for now return just first room
  return filteredRooms[0];
}

module.exports = (server: Server) => {
  const io = socketIo(server);

  //todo variable room rules(clicks + eval) implementation
  //todo send to redis
  let clickerList = {} as { [roomId: string]: Array<Clicker> };
  let isPlaying = false;

  //socket authentication
  socketIoAuth(io, {
    authenticate: async (socket: SocketPlus, data: AuthData, callback) => {
      //todo if playing display to user and make it wait for next video
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
            const { _id } = newUser;
            socket.clientId = _id;
            callback(undefined, { id: newUser._id });
          } catch (e) {
            callback(new Error(e));
          }
        } else {
          //alredy exist
          callback(new Error('Usuário já existente'));
        }
      } else {
        //authenticate
        const { email, code } = data;
        const user = await userModel.findOne({ email });
        if (user) {
          const { _id } = user;
          socket.clientId = _id;
          //todo change what to send to client
          callback(undefined, { id: user._id });
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

    socket.on('disconnect', () => {
      //todo clickerList = [{id: _id, img, name, positive: 0, negative: 0 }]
      //maybe broadcast clickerList instead of the clicker that was removed
      const room = getRoom(socket);
      if (room) {
        clickerList[room] = clickerList[room].filter(
          (clickerObject) => socket.clientId !== clickerObject.id
        );
        socket.broadcast
          .to(room)
          .emit('removeClicker', { id: socket.clientId });
      }
      console.log('Client disconnected');
    });

    //clicked(positive or negative) || clicked(update score)
    socket.on('clicked', (data) => {
      //broadcast
      socket.broadcast.to(getRoom(socket)).emit('clicked', data);
    });

    socket.on('getClickerList', (data: { roomId: string }) => {
      if (!clickerList[getRoom(socket)]) {
        //initiate room in memory
        clickerList[getRoom(socket)] = [];
      }
      //broadcast
      socket.emit('clickerList', clickerList[getRoom(socket)]);
    });

    socket.on('getRooms', async () => {
      const rooms = await roomModel.find();
      socket.emit('rooms', rooms);
    });

    socket.on('joinRoom', async (data: { roomId: string }) => {
      const room = await roomModel.findById(data.roomId);
      const user = await userModel.findById(socket.clientId);
      console.log('joinRoom');

      if (!user) {
        throw new Error('User was not found');
      }
      if (!room) {
        throw new Error('Room was not found');
      }
      const { _id, img, name } = user;

      const newClicker = { id: _id, img, name, positive: 0, negative: 0 };

      //initiate room in memory
      if (!clickerList[getRoom(socket)]) {
        clickerList[getRoom(socket)] = [];
      }
      clickerList[getRoom(socket)].push(newClicker);
      socket.broadcast.emit('newClicker', newClicker);

      //check if user is admin in the room
      const isAdmin = room.admins.includes(_id);

      if (room) {
        socket.leaveAll();
        socket.join(data.roomId);
        socket.emit('joinedRoom', { room, isAdmin });
      } else {
        socket.emit('joinRoomError', { message: 'cannot find room' });
      }
    });

    socket.on('save', async (data: SaveData) => {
      console.log('save', data);
      //todo data validation
      const room = getRoom(socket);
      const { evaluation, clicks, clicker, videoId } = data;

      const score = new scoreModel({
        room,
        evaluation,
        clicks,
        clicker,
        videoId,
      });
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
