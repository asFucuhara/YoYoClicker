import { Router, Request, Response } from 'express';
import * as roomDB from '../database/Room';

const roomRouter = Router();

//Implementetaio as is only one Room upgrade to serve n  Rooms
roomRouter.get('/', async (request: Request, response: Response) => {
  const score = await roomDB.index();
  response.send(score);
});

roomRouter.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await roomDB.show(id);
  response.send(score);
});

roomRouter.post('/', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  try {
    const score = await roomDB.create(scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

roomRouter.put('/:id', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  const { id } = request.params;
  try {
    const score = await roomDB.update(id, scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

roomRouter.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await roomDB.remove(id);
  response.send(score);
});

export default roomRouter;
