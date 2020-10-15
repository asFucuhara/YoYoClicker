import express from 'express';
import path from 'path';

import config from './config';
import routes from './routes';
import { connect as mongoConnect } from './database';

const app = express();

//Starting db
mongoConnect(config.mongoURL);

//Epress Setup
app.use(express.json());
//route
routes(app);


if (process.env.NODE_ENV === 'production') {
  //todo: change for correct path or with ngnix
  console.log('Running in production!');
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  console.log('Running in Dev!');
  app.use('/', (req, res) => {
    res.send('ok....');
  });
}


app.listen(config.PORT, () =>
  console.log('Server Running on PORT:', config.PORT)
);
