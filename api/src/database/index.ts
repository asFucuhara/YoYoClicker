import mongoose from 'mongoose';

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
