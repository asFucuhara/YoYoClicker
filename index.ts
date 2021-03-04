import express from 'express';
import mongoose from 'mongoose';
import * as http from 'http';
import path from 'path';
import config from './config';

//mongoose setup
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGOURL || config.mongoURL,
  { useNewUrlParser: true },
  (error) => (error ? console.error('Db:', error) : console.log('Db Connected'))
);

const app = express();

const server = http.createServer(app);
app.set('io', require('./Services/socket')(server));

if (process.env.NODE_ENV === 'production') {
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

const port = config.PORT;
server.listen(port, () => console.log('Server listeningn on port: ' + port));
