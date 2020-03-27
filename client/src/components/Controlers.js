import React, { useState } from "react";

const Controlers = props => {
  const [inputValue, changeInputValue] = useState("");
  const { muteVideo, videoMuted } = props;

  function handleChange(e) {
    const { value } = e.target;
    changeInputValue(value);
  }

  return (
    <div className="controlers">
      <div className="controlers-buttons">
        {videoMuted ? (
          <a
            className="video-off button"
            onClick={() => props.muteVideo(!videoMuted)}
          >
            Video Off <i className="fas fa-video-slash"></i>
          </a>
        ) : (
          <a
            className="video-off button"
            onClick={() => props.muteVideo(!videoMuted)}
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
        <a className="add button" onClick={() => props.getLink(inputValue)}>
          Add Video <i className="fas fa-plus"></i>
        </a>
      </div>
    </div>
  );
};
export default Controlers;
