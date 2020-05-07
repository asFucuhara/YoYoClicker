const socketIo = require('socket.io');
const socketIoAuth = require('socketio-auth');
const mongoose = require('mongoose');

const userModel = mongoose.model('User');
const scoreModel = mongoose.model('Score');
const clickHistoryModel = mongoose.model('ClickHistory');

module.exports = (server) => {
  const io = socketIo(server);

  const clickerList = [];

  //socket authentication
  socketIoAuth(io, {
    authenticate: async (socket, data, callback) => {
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
            //todo check if newUser has id
            const { _id, img, name } = newUser;
            const newClicker = { id: _id, img, name, positive: 0, negative: 0 };
            clickerList.push(newClicker);
            socket.broadcast.emit('newClicker', newClicker);
            callback(null, { id: newUser._id, clickerList, code });
          } catch (e) {
            //todo check //callback(e);
            callback(new Error(e));
          }
        } else {
          //alredy exist
          callback(new Error('Email já cadastrado'));
        }
        //todo facebook integration
      } else {
        //authenticate
        const { email, code } = data;
        const user = await userModel.findOne({ email });
        //if (user.code == code) {
        if (user) {
          const { _id, img, name, isAdmin } = user;
          if (!isAdmin) {
            const newClicker = { id: _id, img, name, positive: 0, negative: 0 };
            clickerList.push(newClicker);
            socket.broadcast.emit('newClicker', newClicker);
          }
          callback(null, { id: user._id, isAdmin, clickerList });
        } else {
          callback(new Error('Código ou email invalido'));
        }
      }
    },
    postAuthenticate: (socket, data) => {
      //add redis
    },
    disconnect: () => {
      //remove from clicker list
    },
  });
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    //clicked(positive or negative) || clicked(update score)
    socket.on('clicked', (data) => {
      //broadcast
      socket.broadcast.emit('clicked', data);
    });

    socket.on('save', async (data) => {
      console.log(data);
      const score = new scoreModel(data);
      console.log(score);
      await score.save();
      socket.emit('saved');
    });

    socket.on('videoEnded', async (data) => {
      //save summary of clicks
      //save as user ended
      //when ever user ended give ok for admin change video
      const clickHistory = new clickHistoryModel(data);
      await clickHistory.save();
      socket.emit('clickHistorySaved');
    });

    //Admin controls
    socket.on('videoChange', (data) => {
      console.log('videoChange');
      //todo:check if admin
      //todo:check if video can change
      //broadcast video change
      socket.broadcast.emit('videoChange', data);
    });

    socket.on('videoStart', () => {
      console.log('videoStart');
      //todo:check admin
      //todo:chack if can start
      //broadcast
      socket.broadcast.emit('videoStart');
    });

    socket.on('videoPause', () => {
      console.log('videoPause');
      //todo:check admin
      //todo:chack if can start
      //broadcast
      socket.broadcast.emit('videoPause');
    });

    socket.on('videoRestart', () => {
      console.log('videoRestart');
      //todo:check admin
      //todo:chack if can start
      //broadcast
      socket.broadcast.emit('videoRestart');
    });

    socket.on('forceFinishVideo', () => {
      //check admin
      //broadcast message
    });
  });
  return io;
};
