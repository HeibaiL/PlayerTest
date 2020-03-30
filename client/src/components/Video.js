import React from "react";
import YouTube from "react-youtube";

const opts = {
  playerVars: {
    autoplay: 1
  }
};

const Video = props => {
  const { videoMuted, videoId, setNextVideo, addVideo } = props;
  //YouTube API doesn't provive (or I just didn't find) a method to turn off video so it's just simple block covering
                            
  return (
    <div className="video-block">
      <div className="centered">
        {videoMuted ? <div className="mutevideo"></div> : null} 
        <YouTube
          className="youtube"
          opts={opts}
          videoId={videoId}
          onEnd={() => setNextVideo()}
          onStateChange={e => addVideo(e)}
        />
      </div>
    </div>
  );
};
export default Video;
