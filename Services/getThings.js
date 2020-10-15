const mongoose = require('mongoose');

//mongoose setup
mongoose.Promise = global.Promise;
require('../Models/Score');
require('../Models/User');
require('../Models/ClickHistory');

const userModel = mongoose.model('User');
const scoreModel = mongoose.model('Score');
const clickHistoryModel = mongoose.model('ClickHistory');

mongoose.connect(
  process.env.MONGOURL || 'mongodb://localhost:27017/YoyoClicker-Dev',
  { useNewUrlParser: true },
  (error) => (error ? console.error('Db:', error) : console.log('Db Connected'))
);

const getScore = async () => {
  const json = await scoreModel
    .find({
      clicks: {
        $gt: 0,
      },
    })
    .populate('clicker');
  console.log('ok');
  // mapa = {
  //   WtDjDxdytNU: '1A Felipe',
  //   Go7n2Dk_4Y: '1A Patrick Ronckoski',
  //   IM2dazr1VCU: '1A Guxtavo amaral',
  //   wtNjHnLyZrU: '1A Maicon cunha',
  //   VtYLSmqZTsM: '1A Thiago deus smb',
  //   K0iEBB0pbys: '1A Marechal',
  //   '5nv9WT-ZRIk': '1A Heitor Peres',
  //   zpmcS2EUdDg: '1A Guilherme Fragoso',
  //   Lbo1Onk7qK: '1A Rafael Yuri',
  //   gXmpIVvXLHc: '1A Daniel Borges',
  //   '3-Z7uIObFbk': '1A Eduardo Moma',
  //   vznSHrBZ7uc: '1A Shindi',
  //   Cqlw4YwV740: 'OPEN Guxtavo amaral',
  //   NOdeZW1FUCY: 'OPEN Heitor Peres',
  //   QyvuryAWMrE: 'OPEN Eduardo Moma',
  //   aRMucpcKL0w: 'OPEN Daniel Borges',
  //   '-0NFHRZmteo': 'OPEN Guilherme Fragoso',
  //   KfnhYg1pXuE: 'OPEN Patrick Ronckoski',
  // };

  const processed = json.map((object) => {
    console.log(object);
    if (object) {
      const {
        clicks,
        coreografia,
        diversidade,
        controle,
        execucao,
        clicker,
        videoId,
      } = object;
      videoPlayer = mapa[videoId];
      return {
        clicks,
        coreografia,
        diversidade,
        controle,
        execucao,
        clicker: clicker.name,
        videoPlayer,
      };
    }
  });
  console.log(JSON.stringify(processed));
};
