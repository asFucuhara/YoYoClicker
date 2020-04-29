import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class Control extends React.Component {
  state = {
    negative: 0,
    positive: 0,
    score: 0,
  };

  keyFunction = {
    s: () => {
      const { positive, negative } = this.state;
      this.setState({
        negative: negative + 1,
        score: positive - negative - 1,
      });
      this.props.socket.emit('clicked', {
        id: this.props.clientId,
        click: false,
      });
      //this.props.socket.emit('clicked', { positive, negative });
    },
    l: () => {
      const { positive, negative } = this.state;
      this.setState({
        positive: this.state.positive + 1,
        score: this.state.positive - this.state.negative + 1,
      });
      this.props.socket.emit('clicked', {
        id: this.props.clientId,
        click: true,
      });
      //this.props.socket.emit('clicked', { positive, negative });
    },
  };

  onKeyEvent = (key, event) => {
    this.keyFunction[key]();
  };

  render() {
    return (
      <div className="control">
        <KeyboardEventHandler
          handleKeys={Object.keys(this.keyFunction)}
          onKeyEvent={this.onKeyEvent}
        />
        <div className="counterWrapper">
          <div className="button">
            <div>(S)</div>
            <div>Negativo</div>
          </div>
          <div className="negativeCounter counter">{this.state.negative}</div>
        </div>
        <div className="score">
          <div>Score</div>
          <div className="scoreNumber">{this.state.score}</div>
        </div>
        <div className="counterWrapper">
          <div className="positiveCounter counter">{this.state.positive}</div>
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
