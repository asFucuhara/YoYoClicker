import express from 'express';

const app = express();
app.get('/', (request, response) => response.send('yo'))

app.listen(3333, () => console.log('Server Running on PORT = 3000'));
