/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import "./../../../container/Layout/Dashboard/exercise.css";
import ExerciseImage from "./../../../assets/images/exe.jpg";
import PlayBtn from "./../../../assets/images/play-btn.png";

import ReactPlayer from "react-player/lazy";
function Exercise() {
  let [toogle, setToogle] = useState(false);
  let [ImageToggle, setImageToggle] = useState(true);
  let [pressBtn, setPressBtn] = useState(true);

  const playVideo = () => {
    setToogle(true);
    setImageToggle(false);
  };
  const pressButton = () => {
    setPressBtn(false);
  };

  return (
    <div>
      <div className="exercise-wrapper">
        <p>Today Exercise</p>
        {ImageToggle ? (
          <div className="image-container">
            <img class="exe-img" src={ExerciseImage} />
            <div className="play-btn" onClick={() => playVideo()}>
              <img src={PlayBtn} className="" width="50px" />
            </div>
          </div>
        ) : null}

        {toogle ? (
          <div className="video-container">
            <ReactPlayer
              playing={true}
              controls={true}
              className="player-wrapper"
              url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            />
          </div>
        ) : null}

        <div className="exercise-detail">
          <div className="e-d1">
            <div>
              <h5>Day 20</h5>
              <p>Exrecise 7: lorem text</p>
            </div>
            <div
              onClick={() => pressButton()}
              className={pressBtn ? "check-btn" : "press-btn"}
            >
              <i
                class={pressBtn ? `fa fa-check` : `fa fa-check fa-checked`}
                aria-hidden="true"
              ></i>
              Mark as complete
            </div>
          </div>
        </div>
        <div className="exercis-overview">
          <h5>Overview</h5>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Exercise;
