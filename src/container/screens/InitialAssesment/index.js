import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loading } from '../../../redux/actions/loaderActions';
import Header from '../../../container/Layout/Header';
import { Wrapper, Paragraph, SignupButton, SignupText } from './style';
import { NumberValidator } from '../../../shared/validators/Validators';
import Player from '../../../components/player/Player';
import PageStepper from '../../../components/stepper/pageStepper';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';

import {
  fetchSitToStandVideo,
  getUserProfile,
  editUserProfile,
  getQuestionsList,
  sendAnswersList,
} from '../../../apis/userApi';

class InitialScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoUrl: 'https://www.youtube.com/watch?v=w_6hSntq8WI',
      numberOfSits: '',

      screenStatus: false,
    };
  }

  componentDidMount = () => {
    document.getElementById('root').scrollIntoView();
    this.getVideo();
    this.getProfile();
  };

  getVideo = async () => {
    this.props.loading(true);
    let response = await fetchSitToStandVideo();
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
      this.props.loading(false);
      if (response.sts_video.video) this.setState({ videoUrl: response.sts_video.video });
    }
  };

  getProfile = async () => {
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
      this.props.loading(false);
    }
  };

  updateProfile = async () => {
    let response = await editUserProfile({ sts_1: this.state.numberOfSits });
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
      this.props.loading(false);
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  click = async (e) => {
    e.preventDefault();
    let sitsValidator = await NumberValidator(this.state.numberOfSits);

    if (sitsValidator) {
      this.setState({ sitsError: sitsValidator });
    } else {
      this.updateProfile();
      let QuestionsList = await getQuestionsList();
      QuestionsList = await QuestionsList.json();
      this.setState({ ...this.state, QuestionsList, screenStatus: true });
    }
  };

  submitAnswers = async (data) => {
    this.props.loading(true);

    let newData = data;
    newData.forEach(function (v) {
      delete v.choice_text;
    });
    let defaults = { choices: newData };

    let response = await sendAnswersList(defaults);

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

      this.props.loading(false);
      this.props.history.push('/dashboard');
      succesSwal(response.message);

      //response.questionnaire_completed ? this.props.history.push('/dashboard') : this.props.history.push('/initial-assesment');
    }
  };

  render() {
    return (
      <>
        <Header buttonText="signup" />
        {!this.state.screenStatus ? (
          <Wrapper>
            <SignupText isOk={true}>Welcome</SignupText>
            <Paragraph className="my-3">Please add your Sit-to-Stand Test results</Paragraph>

            <Player url={this.state.videoUrl}></Player>

            <form className="my-3" onSubmit={this.click} style={{ width: '440px' }}>
              <label>Number of sit-to-stands</label>
              <span className="position-relative">
                <input
                  type="text"
                  placeholder="Enter the number"
                  name="numberOfSits"
                  value={this.state.numberOfSits}
                  onChange={this.handleChange}
                  maxLength="50"
                  required
                />
                {this.state.sitsError && <span className="error">{this.state.sitsError}</span>}
              </span>

              {this.state.numberOfSits ? (
                <SignupButton tye="submit" className={'w-100 mt-4'}>
                  Next
                </SignupButton>
              ) : (
                <SignupButton className={'w-100 mt-4'} style={{ opacity: 0.5 }}>
                  Next
                </SignupButton>
              )}
            </form>
          </Wrapper>
        ) : (
          <PageStepper
            getAnswers={(data) => {
              this.submitAnswers(data);
            }}
            back={() => this.setState({ screenStatus: false })}
            data={this.state.QuestionsList}
          ></PageStepper>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loader.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loading: (loadingStatus) => {
      dispatch(loading(loadingStatus));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InitialScreen));
