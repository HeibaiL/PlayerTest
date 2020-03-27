import React, { useState, useEffect } from "react";
import "./App.css";
import Video from "./components/Video";
import Controlers from "./components/Controlers";
import List from "./components/List";

function App() {
  const [videoRef, changeVideoRef] = useState("");
  const [videoId, changeVideoId] = useState("");
  const [videoMuted, muteVideo] = useState(false);
  const [nextVideoRef, setNextVideoRef] = useState("");

  useEffect(() => {
    changeVideoId(
      getVideoId(
        "https://www.youtube.com/watch?v=Bk7RVw3I8eg&list=RDBk7RVw3I8eg&start_radio=1"
      )
    );
  }, []);
  function getLink(link) {
    changeVideoId(getVideoId(link));
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
      <List getVideoId={getVideoId} />
      <Video
        videoId={videoId}
        videoMuted={videoMuted}
        getVideoId={getVideoId}
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
