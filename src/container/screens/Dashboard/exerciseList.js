import React, { useEffect, useState, useCallback } from 'react';
import './../../../container/Layout/Dashboard/list.css';
import ExerciseImage from './../../../assets/images/exe.jpg';
import PlayBtn from './../../../assets/images/play-btn.png';
import IncompleteImage from './../../../assets/images/incomplete.png';
import TickImage from './../../../assets/images/tick.png';

import ReactPlayer from 'react-player/lazy';
import { useHistory, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loading } from '../../../redux/actions/loaderActions';

import { get_data } from './../../../redux/actions/product.js';
import { errorSwal } from '../../../components/swal/Swal';
import { getAllExerciseslist } from '../../../apis/userApi';

const ExerciseList = ({ loading, get_data }) => {
  let [toogle, setToogle] = useState(false);
  let [ImageToggle, setImageToggle] = useState(true);
  let [checkAll, setCheckAll] = useState(true);
  let [checkIncomplete, setCheckIncomplete] = useState(false);
  let [checkComplete, setCheckComplete] = useState(false);
  let [headerData, setHeaderData] = useState([]);
  let [exerciseDetail, setExerciseDetail] = useState([]);
  let [keyCheck, setKeyCheck] = useState();
  let history = useHistory();

  const getAllExercises = useCallback(async () => {
    loading(true);
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
      loading(false);
      setHeaderData(response.details);
      setExerciseDetail(response.exercise_status);
    }
  }, [loading]);

  const playVideo = (key) => {
    setKeyCheck(key);
    setToogle(true);
    setImageToggle(false);
  };

  useEffect(() => {
    getAllExercises();
  }, [getAllExercises]);

  function AllList() {
    setCheckAll(true);
    setCheckIncomplete(false);
    setCheckComplete(false);
  }

  function incompleteList() {
    setCheckAll(false);
    setCheckIncomplete(true);
    setCheckComplete(false);
  }

  function completeList() {
    setCheckAll(false);
    setCheckIncomplete(false);
    setCheckComplete(true);
  }

  function goToDetailPage(data, history, key) {
    window.localStorage.setItem('index', key + 1);
    get_data(data, history, key);
    history.push('/dashboard/detail');
  }

  return (
    <div className="main_exercise">
      <div className="header_wrapper">
        <div className={checkAll ? `btn_round` : `btn-grey`}>
          <button onClick={() => AllList()}>All Exercises({headerData['Total Exercises']})</button>
        </div>
        <div className={checkIncomplete ? `btn_round ml` : `btn-grey ml`}>
          <button onClick={() => incompleteList()}>
            Need Completion({headerData['Remaining Exercises']})
          </button>
        </div>
        <div className={checkComplete ? `btn_round ml` : `btn-grey ml`}>
          <button onClick={() => completeList()}>
            Completed({headerData['Completed Exercises']})
          </button>
        </div>
      </div>
      {checkAll
        ? exerciseDetail.map((data, key) => (
            <div className="all-exercises all" key={key}>
              <div className="all_items">
                <div className="all_item1">
                  {ImageToggle ? (
                    <div className="wrapper_container">
                      <img alt="" className="exe-img1" src={ExerciseImage} />
                      <div className="play-btn" onClick={() => playVideo(key)}>
                        <img alt="" src={PlayBtn} className="" width="50px" />
                      </div>
                    </div>
                  ) : null}
                  {toogle ? (
                    <div className="video_container">
                      {keyCheck === key ? (
                        <ReactPlayer
                          playing={true}
                          controls={true}
                          className="player__wrapper"
                          url="https://exhale-30125.s3.amazonaws.com/media/sittostand/video/SampleVideo_1280x720_1mb.mp4"
                        />
                      ) : (
                        <div className="wrapper_container">
                          <img alt="" className="exe-img1" src={ExerciseImage} />
                          <div className="play-btn" onClick={() => playVideo(key)}>
                            <img alt="" src={PlayBtn} className="" width="50px" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="all_item2" onClick={() => goToDetailPage(data, history, key)}>
                  <div className="all_item2_1">
                    <div className="item-day">Day {key + 1}</div>
                    <div className="all_item2_1_2">
                      <img src={data.is_completed === true ? TickImage : IncompleteImage} alt="" />
                      <span
                        className={data.is_completed === true ? `incomplete compl` : `incomplete`}
                      >
                        {data.is_completed === true ? 'Completed' : 'Need Completion'}{' '}
                      </span>
                    </div>
                  </div>
                  <div className="chapter">Exercise 13: {data.series['title']}</div>
                  <div className="overview">Overview</div>
                  <div className="e-detail">{data.exercise['description']}</div>
                </div>
              </div>
            </div>
          ))
        : null}

      {checkIncomplete
        ? exerciseDetail.map((dataVal, key) =>
            dataVal.is_completed === false ? (
              <div className="all-exercises incomplete_exercices" key={key}>
                <div className="all_items">
                  <div className="all_item1">
                    {ImageToggle ? (
                      <div className="wrapper_container">
                        <img alt="" className="exe-img1" src={ExerciseImage} />
                        <div className="play-btn" onClick={() => playVideo()}>
                          <img alt="" src={PlayBtn} className="" width="50px" />
                        </div>
                      </div>
                    ) : null}
                    {toogle ? (
                      <div className="video_container">
                        <ReactPlayer
                          playing={true}
                          controls={true}
                          className="player__wrapper"
                          url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="all_item2" onClick={() => goToDetailPage(dataVal, history, key)}>
                    <div className="all_item2_1">
                      <div className="item-day">Day {key + 1}</div>
                      <div className="all_item2_1_2">
                        <img src={IncompleteImage} alt="" />
                        <span className="incomplete"> Need Completion </span>
                      </div>
                    </div>
                    <div className="chapter">Exercise 13: {dataVal.series['title']}</div>
                    <div className="overview">Overview</div>
                    <div className="e-detail">{dataVal.exercise['description']}</div>
                  </div>
                </div>
              </div>
            ) : null
          )
        : null}
      {checkComplete
        ? exerciseDetail.map((dataValue, key) =>
            dataValue.is_completed === true ? (
              <div className="all-exercises completed_exercises" key={key}>
                <div className="all_items">
                  <div className="all_item1">
                    {ImageToggle ? (
                      <div className="wrapper_container">
                        <img alt="" className="exe-img1" src={ExerciseImage} />
                        <div className="play-btn" onClick={() => playVideo()}>
                          <img alt="" src={PlayBtn} className="" width="50px" />
                        </div>
                      </div>
                    ) : null}
                    {toogle ? (
                      <div className="video_container">
                        <ReactPlayer
                          playing={true}
                          controls={true}
                          className="player__wrapper"
                          url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div
                    className="all_item2"
                    onClick={() => goToDetailPage(dataValue, history, key)}
                  >
                    <div className="all_item2_1">
                      <div className="item-day">Day {key + 1}</div>
                      <div className="all_item2_1_2">
                        <img src={TickImage} alt="" />
                        <span className="incomplete compl"> Completed </span>
                      </div>
                    </div>
                    <div className="chapter">Exercise 13: {dataValue.series['title']}</div>
                    <div className="overview">Overview</div>
                    <div className="e-detail">{dataValue.exercise['description']}</div>
                  </div>
                </div>
              </div>
            ) : null
          )
        : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    dataList: state.app.listData,
    loading: state.loader.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_data: (data, history) => dispatch(get_data(data, history)),
    loading: (loadingStatus) => dispatch(loading(loadingStatus)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExerciseList));
