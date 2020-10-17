import socketIOClient from 'socket.io-client';

export interface AuthResponse {
  id: string;
  isAdmin: boolean;
}

export const session = {
  isAuth: false,
  isAdmin: false,
  socket: socketIOClient.Socket,
  clientId: '',
};

export const socketAuthenticate = (params = {}) => {
  //connect socket
  const socket = socketIOClient('https://yoyo-clicker2.herokuapp.com/');

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      //authentication
      socket.emit('authentication', params);

      //handling authentication
      socket.on('unauthorized', (e: Error) => {
        reject(e);
      });

      socket.on('authenticated', (data: AuthResponse) => {
        session.isAdmin = data.isAdmin;
        session.isAuth = true;
        session.socket = socket;
        session.clientId = data.id;
        resolve();
      });
    });
  });
};
