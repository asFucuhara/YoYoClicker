import mongoose from 'mongoose';

require('./models/User');
require('./models/Score');
require('./models/Room');
require('./models/ClickHistory');

//mongoose setup
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

export const connect = async (mongoURL: string) => {
  try {
    await mongoose.connect(mongoURL);
    console.log('connected to db');
  } catch (err) {
    console.error(err);
    throw err;
  }
};
