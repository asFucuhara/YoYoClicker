import React from 'react';

class AdminPanel extends React.Component {
  render() {
    return (
      <div className="adminPanel">
        <div>
          next video:
          <input type="text" />
        </div>
        <div>
          display next video info!
          <button
            onClick={() =>
              this.props.socket.emit('videoChange', {
                videoId: 'KDMMjKEGckc',
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
