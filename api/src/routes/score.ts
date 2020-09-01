import { Router, Request, Response } from 'express';
import * as scoreDB from '../database/Score';

const scoreRouter = Router();

//Implementetaio as is only one Room upgrade to serve n  Rooms
scoreRouter.get('/', async (request: Request, response: Response) => {
  const score = await scoreDB.index();
  response.send(score);
});

scoreRouter.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await scoreDB.show(id);
  response.send(score);
});

scoreRouter.post('/', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  try {
    const score = await scoreDB.create(scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

scoreRouter.put('/:id', async (request: Request, response: Response) => {
  const scoreObject = request.body;
  const { id } = request.params;
  try {
    const score = await scoreDB.update(id, scoreObject);
    response.send(score);
  } catch (e) {
    response.status(500).send({ error: e });
  }
});

scoreRouter.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const score = await scoreDB.remove(id);
  response.send(score);
});

export default scoreRouter;
