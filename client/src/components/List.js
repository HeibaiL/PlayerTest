import React from "react";
import YouTube from "react-youtube";

const List = props => {

  function showList(arr) {
    return arr.map(link => {
      let id = props.getVideoId(link);
      return (
        <div className="list-element" key={id}>
          <YouTube opts={{height:"100%", width:"100%"} } videoId={id} onPlay={e=>props.onListClick(e)}/>;
        </div>
      );
    });
  }
  return <div className="list">{showList(props.videos)}</div>;
};
export default List;
