import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

const opts = {
  playerVars: {
    autoplay: 1
  }
};

const Video = props => {
  const { videoMuted, videoId } = props;

  return (
    <div className="video-block">
      {videoMuted ? <div className="mutevideo"></div> : null}
      <YouTube
        className="youtube"
        opts={opts}
        videoId={videoId}
        onEnd={e => e.target.loadVideoById("6dHjBpN7gCw")}
      />
    </div>
  );
};
export default Video;
