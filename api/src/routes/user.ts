import { Router, Request, Response } from 'express';
import * as userDB from '../database/User';

const userRouter = Router();

//Implementetaio as is only one Room upgrade to serve n  Rooms
userRouter.get('/', async (request: Request, response: Response) => {
  const score = await userDB.index();
  response.send(score);
});

userRouter.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await userDB.show(id);
  response.send(score);
});

userRouter.post('/', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  try {
    const score = await userDB.create(scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

userRouter.put('/:id', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  const { id } = request.params;
  try {
    const score = await userDB.update(id, scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

userRouter.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await userDB.remove(id);
  response.send(score);
});

export default userRouter;
