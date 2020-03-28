import React, { useState } from "react";

const Controllers = props => {
  const [inputValue, changeInputValue] = useState("");
  const { muteVideo, videoMuted, getLink } = props;

  function handleChange(e) {
    const { value } = e.target;
    changeInputValue(value);
  }

  return (
    <div className="controllers">
      <div className="controllers-buttons">
        {videoMuted ? (
          <a
            className="video-off button"
            onClick={() => muteVideo(!videoMuted)}
          >
            Video Off <i className="fas fa-video-slash"></i>
          </a>
        ) : (
          <a
            className="video-off button"
            onClick={() => muteVideo(!videoMuted)}
          >
            Video On <i className="fas fa-video"></i>
          </a>
        )}
      </div>
      <div className="input-block">
        <input
          placeholder="Video link"
          value={inputValue}
          onChange={handleChange}
        ></input>
        <a className="add button" onClick={() => getLink(inputValue)}>
          Add Video <i className="fas fa-plus"></i>
        </a>
      </div>
    </div>
  );
};
export default Controllers;
