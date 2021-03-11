import React from 'react';

interface JudgeListProps {
  clickers: Clickers;
}

export interface Judge {
  id: string;
  name: string;
  negative: number;
  positive: number;
  img: string;
}

export interface ClickersObject {
  [key: string]: Judge;
}

export interface Clickers {
  list: Array<string>;
  objects: ClickersObject;
}

const JudgesList: React.FC<JudgeListProps> = (props) => {
  return (
    <div className="clicker">
      <div className="clickerList">
        {props.clickers.list.map((id) => {
          const { name, negative, positive, img } = props.clickers.objects[id];
          return (
            <div className="clickerUnit" key={id} id={id}>
              <img src={img} alt="" />
              <div className="text">
                <div className="name">{name}</div>
                <div className="score">
                  <div>
                    <span className="negative">- </span>
                    <span id="negativeNumber">{negative}</span>
                  </div>
                  <div>
                    <span className="positive">+ </span>
                    <span id="positiveNumber">{positive}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JudgesList;
