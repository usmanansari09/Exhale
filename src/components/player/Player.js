import React from 'react';
import ReactPlayer from 'react-player';

import './style.css';

const Player = (props) => {
  return (
    <div className="player-wrapper1">
      <ReactPlayer
        url={props.url}
        className="react-player"
        // light='https://i.ytimg.com/vi/w_6hSntq8WI/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBYqwqb3DjVVnTKMRt2n-BA4YoX0w'
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
};

export default Player;
