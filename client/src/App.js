import React, { useState, useEffect } from "react";
import "./App.css";
import Video from "./components/Video";
import Controllers from "./components/Controllers";
import List from "./components/List";

const endPoint = "http://localhost:4000/graphql";

function App() {
  const [videoNum, changeVideoNum] = useState(0);
  const [videoId, changeVideoId] = useState("");
  const [videoMuted, muteVideo] = useState(false);
  const [isFetching, changeFatching] = useState(false);
  const [videoData, changeVideoData] = useState([]);

  useEffect(() => {
    fetchPlaylist();
  }, []);

  useEffect(() => {
    changeCurrentVideo();
  }, [videoData, videoNum]);

  function getLink(link) {
    changeVideoId(getVideoId(link));
  }
  function changeCurrentVideo() {
    const data = videoData[videoNum];
    if (data) {
      const id = getVideoId(data.ref);
      changeVideoId(id);
    }
  }
  function setFetching() {
    changeFatching(true);
    return setTimeout(() => changeFatching(false), 3000);
  }

  function fetchPlaylist() {
    const requestBody = {
      query: `
        query {
          video {
            ref
          }
        }`
    };
    return fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => res.json())
      .then(res => {
        return changeVideoData([].concat(res.data.video));
      });
  }
  //add and updates video in DB on video state changes (onPause, onPlay)

  function addVideo(e) {
    if (isFetching) return;

    const {
      playerInfo,
      playerInfo: { videoData }
    } = e.target;

    const title = videoData.title.replace(/"([^"]+(?="))"/g, "$1"), //to remove all the qoutes
      ref = playerInfo.videoUrl,
      date = new Date().toISOString(),
      currentTime = playerInfo.currentTime;

    const requestBody = {
      query: `mutation {
        addVideo (videoInput:{title:"${title}", ref:"${ref}", date:"${date}", currentTime:${currentTime}}){
          currentTime
        }
      }`
    };

    fetch(endPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => fetchPlaylist());

    setFetching();
  }
  function setNextVideo() {
    if (videoNum === videoData.length - 1) return changeVideoNum(0);
    return changeVideoNum(videoNum + 1);
  }

  function onListClick(e) {
    const { target } = e;
    target.stopVideo().clearVideo();
    const { videoUrl } = target.playerInfo;
    const id = getVideoId(videoUrl);

    let num = videoData.findIndex(data => {
      const videoId = getVideoId(data.ref);
      return videoId === id;
    });
    changeVideoNum(num);
  }

  function getVideoId(ref) {
    if (!ref) return;

    let strId;
    const startIndex = ref.indexOf("v=") + 2;
    const endIndex = ref.indexOf("&", startIndex);

    if (endIndex === -1) {
      return (strId = ref.slice(startIndex));
    }

    strId = ref.slice(startIndex, endIndex);
    changeVideoNum(videoData.length);
    return strId;
  }

  return (
    <div className="App">
      <List
        getVideoId={getVideoId}
        videoData={videoData}
        onListClick={onListClick}
      />
      <Video
        addVideo={addVideo}
        videoId={videoId}
        videoMuted={videoMuted}
        getVideoId={getVideoId}
        setNextVideo={setNextVideo}
      />
      <Controllers
        getLink={getLink}
        muteVideo={muteVideo}
        videoMuted={videoMuted}
      />
    </div>
  );
}

export default App;
