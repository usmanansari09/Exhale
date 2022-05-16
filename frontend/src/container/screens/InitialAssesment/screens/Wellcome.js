import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loading } from "../../../../redux/actions/loaderActions";
import { sitToStandValidator } from "../../../../shared/validators/Validators";
import Player from "../../../../components/player/Player";
import { fetchSitToStandVideo, getProfile } from "../../../../apis/authApi";

import { Wrapper, Paragraph, SignupButton, SignupText } from "../style";

class InitialScreen extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      videoUrl: "https://www.youtube.com/watch?v=w_6hSntq8WI",
      numberOfSits: "",
    };
  }

  componentDidMount = () => {
    document.getElementById("root").scrollIntoView();
    this.getVideo();
    this.getProfile();
  };

  getVideo = async () => {
    this.props.loading(true);
    let response = await fetchSitToStandVideo();
    if (response.status === 400) {
      response = await response.json();
      // errorSwal('oops',response.non_field_errors[0]);
      this.props.loading(false);
    } else if (response.status === 200) {
      response = await response.json();
      this.props.loading(false);
      // if (response.sts_video.video)
      //   this.setState({ videoUrl: response.sts_video.video });
    }
  };

  getProfile = async () => {
    this.props.loading(true);
    let response = await getProfile();
    if (response.status === 400) {
      response = await response.json();
      // errorSwal('oops',response.non_field_errors[0]);
      this.props.loading(false);
    } else if (response.status === 200) {
      response = await response.json();
      console.log(response);
      this.props.loading(false);
      // if (response.sts_video.video)
      //   this.setState({ videoUrl: response.sts_video.video });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitSitToStand = async (e) => {
    e.preventDefault();

    let sitsValidator = await sitToStandValidator(this.state.numberOfSits);

    if (sitsValidator) {
      this.setState({ sitsError: sitsValidator });
    } else {
      this.props.setOptionValues("situps", this.state.numberOfSits);
      this.props.nextOption(1);
      // this.props.loading(true);
      // let response = await OTP({
      //   email: this.state.resetEmail,
      //   otp: this.state.otp,
      // });
      // if (response.status === 400) {
      //   response = await response.json();
      //   errorSwal("oops", response.message);
      //   this.props.loading(false);
      // } else if (response.status === 201) {
      //   response = await response.json();
      //   this.props.loading(false);
      //   this.setState({ showOTPModal: false });
      //   succesSwal(response.message);
      // }

      //this.submitSignup();
    }
  };

  render() {
    return (
      <>
        <Wrapper>
          <SignupText isOk={true}>Welcome</SignupText>
          <Paragraph className="my-3">
            Please add your Sit-to-Stand Test results
          </Paragraph>

          <Player url={this.state.videoUrl}></Player>

          <form
            className="my-3"
            onSubmit={this.submitSitToStand}
            style={{ width: "440px" }}
          >
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
              {this.state.sitsError && (
                <span className="error">{this.state.sitsError}</span>
              )}
            </span>

            {this.state.sitsError && (
              <span className="error">{this.state.sitsError}</span>
            )}

            {this.state.numberOfSits ? (
              <SignupButton type="submit" className={"w-100 mt-4"}>
                Next
              </SignupButton>
            ) : (
              <SignupButton className={"w-100 mt-4"} style={{ opacity: 0.5 }}>
                Next
              </SignupButton>
            )}
          </form>
        </Wrapper>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InitialScreen)
);
