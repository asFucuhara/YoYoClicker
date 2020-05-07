import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class Control extends React.Component {
  keySpec = {
    s: false,
    l: true,
  };

  render() {
    return (
      <div className="control">
        <KeyboardEventHandler
          handleKeys={Object.keys(this.keySpec)}
          onKeyEvent={(key) => this.props.click(this.keySpec[key])}
        />
        <div className="counterWrapper" onClick={() => this.props.click(false)}>
          <div className="button">
            <div>(S)</div>
            <div>Negativo</div>
          </div>
          <div className="negativeCounter counter">{this.props.negative}</div>
        </div>
        <div className="score">
          <div>Score</div>
          <div className="scoreNumber">{this.props.score}</div>
        </div>
        <div className="counterWrapper" onClick={() => this.props.click(true)}>
          <div className="positiveCounter counter">{this.props.positive}</div>
          <div className="button">
            <div>(L)</div>
            <div>Positivo</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Control;
