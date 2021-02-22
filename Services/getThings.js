const mongoose = require('mongoose');

//mongoose setup
mongoose.Promise = global.Promise;
require('../Models/Score');
require('../Models/User');
require('../Models/ClickHistory');

const userModel = mongoose.model('User');
const scoreModel = mongoose.model('Score');
const clickHistoryModel = mongoose.model('ClickHistory');

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true }, (error) =>
  error ? console.error('Db:', error) : console.log('Db Connected')
);

const getScore = async () => {
  const mapa = {
    Tb1vTLkv15Y: 'BETTY GALLEGOS',
    nVlwNQ4mYJA: 'SEBASTIAN LAVIN',
    DvpFzR7toHk: 'EMILIANO RIVERO',
    'i-Hl5a34jGw': 'MARTIN MUÑOZ',
    'rH2qIo-y13U': 'ANIBAL ROJAS',
    '2yiHIeBo52s': 'IGNACIO FERNANDEZ',
    RWWwp119GN8: 'MATIAS JENSEN',
    '5AxKnpcm6H8': 'KEVIN GONZALEZ',
    '2UsrHfSdczE': 'JOSUE VILLAMAR',
    cGAS_5LQgL4: 'DANIEL BORGES',
    'MnMy9-UCTWE': 'GUILHERME FRAGOSO',
    WOheLIxhjqI: 'PATRCIK RONCOSKI',
    UdydTULJ_YQ: 'HIDEKI YASSUDA',
    wtGxXekSbsc: 'RAFAEL YURI',
    xL8h8XtkpmI: 'ANDRE SHINDI FUCUHARA',
    IjyIsHUTj1c: 'JONES ROGER',
    'aDf-SPEY-xk': 'MATHIAS FERNANDEZ',
    GuBD1SfcxNI: 'FARID BERMUDEZ',
  };

  const json = await scoreModel
    .find({
      videoId: { $in: Object.keys(mapa) },
    })
    .populate('clicker');
  console.log(json, 'aaaa');
  // const mapa = {
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

getScore();
