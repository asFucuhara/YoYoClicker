import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

//todo eventualy create types to react-keyboard-event-handler
interface ControlProps {
  positive: number;
  negative: number;
  score: number;
  click: (type: boolean) => void;
}

const keySpec: {[key:string]: boolean} = {
  s: false,
  l: true,
};

const Control: React.FC<ControlProps> = (props) => {
  return (
    <div className="control">
      <KeyboardEventHandler
        handleKeys={Object.keys(keySpec)}
        onKeyEvent={(key) => props.click(keySpec[key])}
      />
      <div className="counterWrapper" onClick={() => props.click(false)}>
        <div className="button">
          <div>(S)</div>
          <div>Negativo</div>
        </div>
        <div className="negativeCounter counter">{props.negative}</div>
      </div>
      <div className="score">
        <div>Score</div>
        <div className="scoreNumber">{props.score}</div>
      </div>
      <div className="counterWrapper" onClick={() => props.click(true)}>
        <div className="positiveCounter counter">{props.positive}</div>
        <div className="button">
          <div>(L)</div>
          <div>Positivo</div>
        </div>
      </div>
    </div>
  );
};

export default Control;
