import React, { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export interface VideoEvents {
  onReady: YouTubeProps['onReady'];
  onStateChange: YouTubeProps['onStateChange'];
}

export interface PlayerProps {
  videoEvents: VideoEvents;
  videoId?: string;
  setPlayerRef?: any;
}

const Player: React.FC<PlayerProps> = (props) => {
  const opts = {
    playerVars: {
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
    },
  } as YouTubeProps['opts'];

  const onReadyWrapper: YouTubeProps['onReady'] = (event) => {
    if (props.setPlayerRef) {
      props.setPlayerRef(event.target);
      console.log('jobs done', event.target);
    }
    if (props.videoEvents.onReady) {
      props.videoEvents.onReady(event);
    }
  };

  return (
    <div className="video">
      <YouTube
        containerClassName={'videoContainer'}
        videoId={props.videoId}
        opts={opts}
        onReady={onReadyWrapper}
        onStateChange={props.videoEvents.onStateChange}
      />
    </div>
  );
};
export default Player;
