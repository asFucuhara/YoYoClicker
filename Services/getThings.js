const mongoose = require('mongoose');

//mongoose setup
mongoose.Promise = global.Promise;
require('./ScoreModel');
require('./UserModel');
const scoreModel = mongoose.model('Score');

//todo put mongouri
const mongoURL =
  '';

mongoose.connect(
  process.env.MONGOURL || mongoURL,
  { useNewUrlParser: true },
  (error) => (error ? console.error('Db:', error) : console.log('Db Connected'))
);

const getScore = async () => {
  const mapa = {
    'alaMBvlXL-k': 'OPEN Heitor Peres Cavalcante',
    '9DzCr6iF0CM': 'OPEN André Shindi Fucuhara',
    sQ_O8seWMBs: 'OPEN Robyen Juan',
    'Frit-29475A': 'OPEN Eduardo Monma',
    '8Gps64NA4qg': 'OPEN Guilherme Fragoso',
    wlrcRu5gtN4: 'AMADOR Gabriel Martins Machado',
    yTtBlz7pTjo: 'AMADOR Erolaine de oliveira mateus',
    Xqwepj9G0_0: 'AMADOR Artur Bernardes Damo',
    jmtTOKe1a8s: 'AMADOR Gustavo Henrique dos Santos',
    '9Mqpqmmbj-w': 'AMADOR Ricardo Massayuki Ishii',
    _fjSjg8ZPwk: 'AMADOR Cadu Caetano',
    tHsr1Or1Lk8: 'AMADOR Theo Puglia Ferraz de Camargo',
    g9QuSkH5W30: 'AMADOR Farley Saimon Silva Borba',
    WwPeL_OtMbw: 'AMADOR Dante Völker',
    jJjXmJIjFEg: 'AMADOR João Couto Oliveira Rosa',
    sAC1ayI0hdc: 'AMADOR Daniela Stain Gatti',
    gUpuLslMVDo: 'AMADOR Rodrigo de Sousa',
    W_UiCjNWYNs: 'AMADOR Guilherme Ruthes',
    jhFwmgnw85A: 'AMADOR Alex de Azevedo Bueno',
    ai_f1DgTYTg: 'PRO Heitor Peres Cavalcante',
    gSWFvZmj5Pc: 'PRO André Shindi Fucuhara',
    WntMulV3QXE: 'PRO Robyen Juan',
    bTRK1laYLqU: 'PRO Eduardo Monma',
    mzKTndAI4J8: 'PRO Guilherme Fragoso',
    'IIag-h41mvA': 'PRO Bernardo Moratori Peixoto',
    BGRp_WZSdo4: 'PRO Danyllo Robert Barbiero',
    yG0DbH210RM: 'PRO Thiago Lima de Azevedo',
    sSYkBee9LUA: 'PRO Hideki Yassuda',
    FGtnuC9o04k: 'PRO ThiagoSMB',
    '4sOlRjm8vRs': 'PRO João Henrique de Sant’Ana',
    ZNf9vQc6QUM: 'PRO Rafael Yuri',
    Fpdvb4XL8Vk: 'PRO Jones Roger',
  };

  const json = await scoreModel
    .find({
      videoId: { $in: Object.keys(mapa) },
    })
    .populate('clicker');

  const jsonP1 = json.filter((object) => object.coreografia);

  const processed = jsonP1.map((object) => {
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
        controle,
        risco: execucao,
        diversidade,
        coreografia,
        clicker: clicker.name,
        video: videoPlayer,
      };
    }
  });
  console.log(JSON.stringify(processed));
};

getScore();
