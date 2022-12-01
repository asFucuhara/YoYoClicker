import socketIOClient from 'socket.io-client';

export interface AuthResponse {
  id: string;
}

export const session = {
  isAuth: false,
  socket: socketIOClient.Socket,
  clientId: '',
};

export const socketAuthenticate = (params = {}) => {
  //connect socket
  const socket = socketIOClient('localhost:4000');

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      //authentication
      socket.emit('authentication', params);

      //handling authentication
      socket.on('unauthorized', (e: Error) => {
        reject(e);
      });

      socket.on('authenticated', (data: AuthResponse) => {
        session.isAuth = true;
        session.socket = socket;
        session.clientId = data.id;
        //todo resolve response
        resolve(true);
      });
    });
  });
};
