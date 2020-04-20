const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const server = http.createServer(app);
app.set('io', require('./Services/sockeio')(server));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
    app.use('/', (req, res) => {res.send('ok')})
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Server listeningn on port: ' + port));
