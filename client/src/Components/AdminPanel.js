import React from 'react';

class AdminPanel extends React.Component {
  state = {
    next: '',
  };
  render() {
    return (
      <div className="adminPanel">
        <div>
          next video:
          <input
            type="text"
            value={this.state.next}
            onChange={(event) => this.setState({ next: event.target.value })}
          />
        </div>
        <div>
          display next video info!
          <button
            onClick={() =>
              this.props.socket.emit('videoChange', {
                videoId: this.state.next,
              })
            }
          >
            confirm
          </button>
        </div>
        <div>
          <button onClick={() => this.props.socket.emit('videoStart')}>
            Start
          </button>
          <button onClick={() => this.props.socket.emit('videoPause')}>
            Stop
          </button>
          <button onClick={() => this.props.socket.emit('videoRestart')}>
            Restart
          </button>
        </div>
      </div>
    );
  }
}

export default AdminPanel;
