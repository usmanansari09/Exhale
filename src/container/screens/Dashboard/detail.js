import React, { useEffect, useState } from 'react';
import ExerciseImage from './../../../assets/images/exe.jpg';
import PlayBtn from './../../../assets/images/play-btn.png';
import PlayList from './../../../assets/images/play-list.png';

import ReactPlayer from 'react-player/lazy';
import './../../../container/Layout/Dashboard/detail.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get_data } from './../../../redux/actions/product.js';
import { getAllExerciseslist, submitCompleteExercise } from '../../../apis/userApi';
import { errorSwal } from '../../../components/swal/Swal';

const DetailPage = ({ dataList }) => {
  let [toogle, setToogle] = useState(false);
  let [ImageToggle, setImageToggle] = useState(true);
  let [pressBtn, setPressBtn] = useState(true);
  let [exerciseDetail, setExerciseDetail] = useState([]);
  let [titleName, setTitleName] = useState('');
  let [sideDesc, setSideDesc] = useState('');
  let [sideUrl, setSideUrl] = useState('');
  let [sidetrigger, setSideTrigger] = useState(false);
  let [sideKey, setSideKey] = useState('');
  let [sideId, setSideId] = useState('');

  const getAllExercises = async () => {
    // loading(true);
    let response = await getAllExerciseslist();
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
      await setExerciseDetail(response.exercise_status);
    }
  };

  const playVideo = () => {
    setToogle(true);
    setImageToggle(false);
  };

  const completeExercise = async () => {
    var formdata = { is_completed: 'True' };

    let response = await submitCompleteExercise(sidetrigger ? sideId : dataList.id, formdata);
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
    setPressBtn(false);
    completeExercise();
  };

  useEffect(() => {
    getAllExercises();
  }, []);

  const playSideVideo = (data, key) => {
    setTitleName(data.series['title']);
    setSideDesc(dataList.exercise['description']);
    setSideUrl(dataList.exercise['video']);
    setSideKey(key);
    setSideId(data.id);
    setSideTrigger(true);
  };

  return (
    <div>
      {Object.keys(dataList).length !== 0 ? (
        <div className="details_wrapper">
          <div className="video_detail">
            {ImageToggle ? (
              <div className="image__container">
                <img className="exe-img" alt="" src={ExerciseImage} />
                <div className="play-btn" onClick={() => playVideo()}>
                  <img src={PlayBtn} alt="" className="" width="50px" />
                </div>
              </div>
            ) : null}
            {toogle ? (
              <div className="video__container">
                <ReactPlayer
                  playing={true}
                  controls={true}
                  className="player_wrapper"
                  url={setSideTrigger ? `${sideUrl}` : `${dataList.exercise['video']}`}
                />
              </div>
            ) : null}
            <div className="exercise__detail">
              <div className="e-d1">
                <div>
                  <h5>Day {sidetrigger ? sideKey + 1 : window.localStorage.getItem('index')}</h5>
                  <div>Exrecise 7: {sidetrigger ? titleName : dataList.series['title']}</div>
                </div>
                <div onClick={() => pressButton()} className={pressBtn ? 'check-btn' : 'press-btn'}>
                  <i
                    className={pressBtn ? `fa fa-check` : `fa fa-check fa-checked`}
                    aria-hidden="true"
                  ></i>
                  Mark as complete
                </div>
              </div>
            </div>
            <div className="exercis__overview ">
              <div className="overview">Overview</div>
              <p>{sidetrigger ? sideDesc : dataList.exercise['description']}</p>
            </div>
          </div>
          <div className="video_lists">
            {exerciseDetail.map((data, key) => (
              <div className="playlist__wrapper" key={key} onClick={() => playSideVideo(data, key)}>
                <div className="video__palylist">
                  <div>
                    <h6>Day {key + 1}</h6>
                    <p>Exercise 12: {data.series['title']}</p>
                  </div>
                  <div onClick={() => playVideo()}>
                    <img src={PlayList} className="play-list-icon" alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    dataList: state.app.listData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_data: (data, history) => dispatch(get_data(data, history)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailPage));
