import React, { useState, useEffect } from "react";
import "./App.css";
import Video from "./components/Video";
import Controllers from "./components/Controllers";
import List from "./components/List";
import Login from "./components/Login";

const endPoint = "http://localhost:4000/graphql";

function App() {
  const [videoNum, changeVideoNum] = useState(0);
  const [videoId, changeVideoId] = useState("");
  const [videoMuted, muteVideo] = useState(false);
  const [isFetching, changeFatching] = useState(false);
  const [videoData, changeVideoData] = useState([]);
  const [loggedUser, setUser] = useState("");
  const [isTaken, setTaken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) setUser(token);
    fetchPlaylist();
    window.onbeforeunload = function(e) {
      e.preventDefault();
      return deleteViewer();
    };
  }, []);

  useEffect(() => {
    checkViewer();
  }, [loggedUser]);

  useEffect(() => changeCurrentVideo(), [videoData, videoNum]);

  //you should logOut so another person can use a player
  function deleteViewer() {
    if (!loggedUser) return;
    const requestBody = {
      query: `
      mutation{
        deleteViewer(token:"${loggedUser}"){
          userId
        }
      }`
    };
    return fetchData(requestBody).then(res => res.json());
  }

  function fetchData(requestBody) {
    return fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
  }

  function getLink(link) {
    const id = getVideoId(link);

    let num = videoData.findIndex(data => {
      const videoId = getVideoId(data.ref);
      return videoId === id;
    });
    changeVideoNum(num);
    return changeVideoId(getVideoId(link));
  }
  function logOut() {
    localStorage.removeItem("auth-token");
    deleteViewer();
    window.location.reload();
    return setUser("");
  }

  function checkViewer() {
    const requestBody = {
      query: `
        query {
          viewer {
            userId
          }
        }`
    };
    return fetchData(requestBody)
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          return setViewer();
        } else if (res.data) {
          return setTaken(true);
        }
      });
  }

  function setViewer() {
    if (!loggedUser) return;
    const requestBody = {
      query: `
      mutation{
        setViewer(token:"${loggedUser}"){
          userId
        }
      }`
    };
    return fetchData(requestBody).then(res => res.json());
  }
  function changeCurrentVideo() {
    const data = videoData[videoNum || 0];
    if (data) {
      const id = getVideoId(data.ref);
      return changeVideoId(id);
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
    return fetchData(requestBody)
      .then(res => res.json())
      .then(res => {
        changeVideoData([].concat(res.data.video));
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

    fetchData(requestBody).then(() => fetchPlaylist());

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
      {loggedUser ? (
        <div className="container">
          <List
            getVideoId={getVideoId}
            videoData={videoData}
            onListClick={onListClick}
          />
          {isTaken ? (
            <div className="taken">
              Sorry, but the player is being used by another user right now. You
              still can add new videos, tho! 
              <br/>
              <br/>
              Also you can Log Out and try again
            </div>
          ) : (
            <Video
              addVideo={addVideo}
              videoId={videoId}
              videoMuted={videoMuted}
              getVideoId={getVideoId}
              setNextVideo={setNextVideo}
            />
          )}
          <Controllers
            getLink={getLink}
            muteVideo={muteVideo}
            videoMuted={videoMuted}
          />
        </div>
      ) : (
        <Login setUser={setUser} endPoint={endPoint} />
      )}
      <a href="/#" className="logOut button" onClick={() => logOut()}>
        Log Out<i className="fas fa-sign-out-alt"></i>
      </a>
    </div>
  );
}

export default App;
