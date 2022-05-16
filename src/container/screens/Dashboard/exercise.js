/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import './../../../container/Layout/Dashboard/exercise.css';
import ExerciseImage from './../../../assets/images/exe.jpg';
import PlayBtn from './../../../assets/images/play-btn.png';

import ReactPlayer from 'react-player/lazy';
import {
  submitCompleteExercise,
  getUserProfile,
  submitCompleteLesson,
} from '../../../apis/userApi';
import { errorSwal } from '../../../components/swal/Swal';

function Exercise() {
  const [userProfileData, setUserProfileData] = useState({});
  const [noData, setNoData] = useState(false);

  const [todaysId, setTodaysId] = useState();
  let [toogle, setToogle] = useState(false);
  let [ImageToggle, setImageToggle] = useState(true);
  let [isCompleted, setIsCompleted] = useState(false);

  const playVideo = () => {
    setToogle(true);
    setImageToggle(false);
  };

  const getUserProfileData = async () => {
    let response = await getUserProfile();
    if (response.status >= 400) {
      response = await response.json();
      this.props.loading(false);
      if (!response.message) {
        let message = '';
        for (const [key, value] of Object.entries(response)) {
          message = message + `${key} : ${JSON.stringify(value)} `;
        }
        errorSwal('oops', message);
      } else {
        errorSwal('oops', response.message);
      }
    } else if (response.status === 200) {
      response = await response.json();
      let data = {};
      if (response.details.todays_exercise.length > 0) {
        data = response.details.todays_exercise[0].exercise;
        data['type'] = 'Todays Exercise';
        setTodaysId(response.details.todays_exercise[0].id);
        setIsCompleted(response.details.todays_exercise[0].is_completed);
        setNoData(false);
        setUserProfileData(data);
      } else if (response.details.todays_lesson.length > 0) {
        data = response.details.todays_lesson[0].lesson;
        data['type'] = 'Todays Lesson';
        setIsCompleted(response.details.todays_lesson[0].is_completed);
        setTodaysId(response.details.todays_lesson[0].id);
        setNoData(false);
        setUserProfileData(data);
      } else setNoData(true);
    }
  };

  const completeExercise = async () => {
    var formdata = { is_completed: 'True' };
    let response = null;
    if (userProfileData.type === 'Todays Lesson') {
      response = await submitCompleteLesson(todaysId, formdata);
    } else {
      response = await submitCompleteExercise(todaysId, formdata);
    }

    if (response.status >= 400) {
      response = await response.json();
      this.props.loading(false);
      if (!response.message) {
        let message = '';
        for (const [key, value] of Object.entries(response)) {
          message = message + `${key} : ${JSON.stringify(value)} `;
        }
        errorSwal('oops', message);
      } else {
        errorSwal('oops', response.message);
      }
    } else if (response.status === 200) {
      response = await response.json();
    }
  };

  const pressButton = () => {
    if (true) {
      setIsCompleted(true);
      completeExercise();
    }
  };

  useEffect(() => {
    getUserProfileData();
  }, []);

  return (
    <div>
      {userProfileData.type && (
        <div className="exercise-wrapper">
          <p>{userProfileData.type}</p>
          {ImageToggle ? (
            <div className="image-container">
              <img className="exe-img" alt="" src={ExerciseImage} />
              <div className="play-btn" onClick={() => playVideo()}>
                <img src={PlayBtn} alt="" className="" width="50px" />
              </div>
            </div>
          ) : null}

          {toogle ? (
            <div className="image-container exe-img">
              <ReactPlayer
                playing={true}
                controls={true}
                className="player-wrapper"
                url={`${userProfileData.video}`}
              />
            </div>
          ) : null}

          <div className="exercise-detail">
            <div className="e-d1">
              <div>
                <h5>Day 20</h5>
                <div>{userProfileData.title}</div>
              </div>
              <div
                onClick={() => pressButton()}
                className={isCompleted ? 'press-btn' : 'check-btn'}
              >
                <i
                  className={isCompleted ? `fa fa-check fa-checked` : `fa fa-check`}
                  aria-hidden="true"
                ></i>
                {isCompleted ? 'Completed' : 'Mark as complete'}
              </div>
            </div>
          </div>
          <div className="exercis-overview">
            <div>Overview</div>
            <p>{userProfileData.description}</p>
          </div>
        </div>
      )}

      {noData && (
        <div className="exercise-wrapper">
          <p className="text-center"> No Lesson/Exercise Available.</p>
        </div>
      )}
    </div>
  );
}

export default Exercise;
