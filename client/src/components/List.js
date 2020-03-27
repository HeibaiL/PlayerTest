import React from "react";
import YouTube from "react-youtube";

const List = props => {
  let videos = [
    "https://www.youtube.com/watch?v=3Q_oYDQ2whs",
    "https://www.youtube.com/watch?v=S6HZvF-s8KI"
  ];

  function showList(arr) {
    return arr.map(link => {
      let id = props.getVideoId(link);
      return <YouTube videoId={id}  />;
    });
  }
  return <div className="list">
      {showList(videos)}
  </div>;
};
export default List;
