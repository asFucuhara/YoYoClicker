const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');

//mongoose setup
mongoose.Promise = global.Promise;
require('./Models/Score');
require('./Models/User');
require('./Models/ClickHistory');
mongoose.connect(
  process.env.MONGOURL || 'mongodb://localhost:27017/YoyoClicker-Dev',
  { useNewUrlParser: true },
  () => console.log('Db Connected')
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

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Server listeningn on port: ' + port));
