import React from "react";
import YouTube from "react-youtube";

const opts = {
  playerVars: {
    autoplay: 1
  }
};

const Video = props => {
  const { videoMuted, videoId, setNextVideo, addVideo } = props;

  return (
    <div className="video-block">
      {videoMuted ? <div className="mutevideo"></div> : null}
      <YouTube
        className="youtube"
        opts={opts}
        videoId={videoId}
        onEnd={() => setNextVideo()}
        onStateChange={e => addVideo(e)}
      />
    </div>
  );
};
export default Video;
