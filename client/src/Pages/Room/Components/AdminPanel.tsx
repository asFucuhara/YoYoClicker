import React, { useState } from 'react';

interface AdminPanelProps {
  adminFunctions: {
    videoChange: (data: { videoId: string }) => void;
    videoStart: () => void;
    videoPause: () => void;
    videoRestart: () => void;
  };
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [next, setNext] = useState('');

  return (
    <div className="adminPanel">
      <div>
        next video:
        <input
          type="text"
          value={next}
          onChange={(event) => setNext(event.target.value)}
        />
      </div>
      <div>
        display next video info!
        <button
          onClick={() =>
            props.adminFunctions.videoChange({
              videoId: next,
            })
          }
        >
          confirm
        </button>
      </div>
      <div>
        <button onClick={props.adminFunctions.videoStart}>Start</button>
        <button onClick={props.adminFunctions.videoPause}>Stop</button>
        <button onClick={props.adminFunctions.videoRestart}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
