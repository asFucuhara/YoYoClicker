import { Express } from 'express';

//imports routes
import scoreRouter from './score';
import roomRouter from './room';
import userRouter from './user';

function routes(app: Express) {
  app.use('/score', scoreRouter);
  app.use('/room', roomRouter);
  app.use('/user', userRouter);
}

export default routes;
