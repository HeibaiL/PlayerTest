import React from "react";
import YouTube from "react-youtube";

const List = props => {
  const { videoData, onListClick, getVideoId } = props;
  function showList(arr) {
    return arr.map(data => {
      const id = getVideoId(data.ref)

      return (
        <div className="list-element" key={id}>
          <YouTube
            opts={{ height: "100%", width: "100%" }}
            videoId={id}
            x
            onPlay={e => onListClick(e)}
          />
          ;
        </div>
      );
    });
  }

  return <div className="list">{showList(videoData)}</div>;
};
export default List;
