import ScoreModel from './models/Score';
import { User } from './types/User';
import { Room } from './types/Room';
import { Score } from './types/Score';

export interface ScoreCreateObject {
  videoId: string;
  clicker: User['_id'];
  clicks: Number;
  room: Room['_id'];
  evaluation: Array<string>;
}

export interface ScoreUpdateObject {
  videoId?: string;
  clicker?: User['_id'];
  clicks?: Number;
  room?: Room['_id'];
  evaluation?: Array<string>;
}

export async function index() {
  const scores = await ScoreModel.find();
  return scores;
}

export async function show(id: Score['_id']) {
  const score = await ScoreModel.findById(id);
  return score;
}

export async function create(scoreCreateObject: ScoreCreateObject) {
  try {
    console.log(scoreCreateObject);
    const score = await ScoreModel.create(scoreCreateObject);
    return score;
  } catch (e) {
    throw e;
  }
}

export async function update(
  id: Score['_id'],
  scoreUpdateObject: ScoreUpdateObject
) {
  const score = await ScoreModel.findByIdAndUpdate(id, scoreUpdateObject);
  return score;
}

//todo addGuest() addJudges() addGuest()

export async function remove(id: Score['_id']) {
  const score = await ScoreModel.findByIdAndDelete(id);
  return score;
}

//todo "temporary" --- do a factory instead
export const getScore = async () => {
  const json = await ScoreModel.find({
    clicks: {
      $gt: 0,
    },
  }).populate('clicker');

  //temporary
  const mapa: any = {
    '1RdoOFLzeWg': 'Takumi Hakamata',
    OiA7P9lgH3Y: 'Masahiro Terada',
    xIBbIu7IF7U: 'Gustavo Amaral 4a',
    hyRv98XPsSs: 'Remy Baskin - 1st Place - 1A Final - 2020 PNWR',
    MQ71sr4bOo0: 'Yuta Kashiwaya',
  };

  const processed = json.map((object) => {
    if (object) {
      const { clicks, clicker, videoId } = object;
      const player = mapa[videoId];
      return {
        clicks,
        clicker: clicker.name,
        player,
      };
    }
  });
  console.log(JSON.stringify(processed));
};
