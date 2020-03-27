import React, { useState, useEffect } from "react";
import "./App.css";
import Video from "./components/Video";
import Controlers from "./components/Controlers";
import List from "./components/List";

let videos = [
  "https://www.youtube.com/watch?v=8nW-IPrzM1g&list=RDBk7RVw3I8eg",
  "https://www.youtube.com/watch?v=Bk7RVw3I8eg&list=RDBk7RVw3I8eg&start_radio=1",
  "https://www.youtube.com/watch?v=VdwH3RDRXNM",
  "https://www.youtube.com/watch?v=S6HZvF-s8KI"
];

function App() {
  const [videoNum, changeVideoNum] = useState(0);
  const [videoId, changeVideoId] = useState("");
  const [videoMuted, muteVideo] = useState(false);

  useEffect(() => {
    changeVideoId(getVideoId(videos[videoNum]));
  }, [videoNum]);

  function getLink(link) {
    changeVideoId(getVideoId(link));
    videos.push(link);
  }

  function setNextVideo() {
    if (videoNum === videos.length - 1) return changeVideoNum(0);
    return changeVideoNum(videoNum + 1);
  }

  function onListClick(e) {
    const { target } = e;
    target.stopVideo().clearVideo();
    const { videoUrl } = target.playerInfo;

    let num = videos.findIndex(url => {
      return url.includes(videoUrl);
    });

    changeVideoNum(num);
    changeVideoId(getVideoId(videoUrl));
  }

  function getVideoId(ref) {
    let strId;
    const startIndex = ref.indexOf("v=") + 2;
    const endIndex = ref.indexOf("&");
    if (endIndex === -1) {
      strId = ref.slice(startIndex);
      return strId;
    }
    strId = ref.slice(startIndex, endIndex);
    return strId;
  }

  return (
    <div className="App">
      <List
        getVideoId={getVideoId}
        videos={videos}
        onListClick={onListClick}
        getVideoId={getVideoId}
      />
      <Video
        videoId={videoId}
        videoMuted={videoMuted}
        getVideoId={getVideoId}
        setNextVideo={setNextVideo}
      />

      <Controlers
        getLink={getLink}
        muteVideo={muteVideo}
        videoMuted={videoMuted}
      />
    </div>
  );
}

export default App;
