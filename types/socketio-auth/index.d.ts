declare module 'socketio-auth' {
  import { Server, Socket } from 'socket.io';

  interface AuthCallback {
    (err?: Error, success?: any): void;
  }

  interface Config {
    authenticate: (socket: Socket, data: any, callback: AuthCallback) => void;
    postAuthenticate?: (socket, data) => void;
    disconnect?: (socket) => void;
    timeout?: number;
  }

  function socketIoAuth(io: Server, config: Config): void;
  export = socketIoAuth;
}
