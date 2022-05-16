import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import _isEmpty from "lodash/isEmpty";

import { loading } from "../../../../redux/actions/loaderActions";

import { Wrapper, SignupButton, SignupText, Row } from "../style";

class InitialScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: {},
    };
  }

  componentDidMount = () => {
    document.getElementById("root").scrollIntoView();
  };

  handleChange = (event) => {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitSitToStand = async (e) => {
    e.preventDefault();

    if (!_isEmpty(this.state.option)) {
      this.props.setOptionValues(
        `questionId${this.props.item?.id}`,
        this.state.option
      );
      this.props.nextOption(this.props.item?.id + 1);
    }
    // let errorStatus = false;

    // let sitsValidator = await sitToStandValidator(this.state.numberOfSits);

    // if (sitsValidator) {
    //   this.setState({ sitsError: sitsValidator });
    //   // errorStatus = true;
    // } else {
    //   // this.props.loading(true);
    //   // let response = await OTP({
    //   //   email: this.state.resetEmail,
    //   //   otp: this.state.otp,
    //   // });
    //   // if (response.status === 400) {
    //   //   response = await response.json();
    //   //   errorSwal("oops", response.message);
    //   //   this.props.loading(false);
    //   // } else if (response.status === 201) {
    //   //   response = await response.json();
    //   //   this.props.loading(false);
    //   //   this.setState({ showOTPModal: false });
    //   //   succesSwal(response.message);
    //   // }

    //   //this.submitSignup();
    // }
  };

  handleCheckboxChange = (id) => {
    const obj = this.state.option;
    if (obj[`id${id}`]) {
      obj[`id${id}`] = !obj[`id${id}`];
    } else {
      obj[`id${id}`] = true;
    }

    this.setState({ option: obj });
  };

  handleRadioButtonChange = (id) => {
    const obj = this.state.option;
    if (obj[`id`]) {
      obj[`id`] = id;
    } else {
      obj[`id`] = id;
    }

    this.setState({ option: obj });
  };
  render() {
    const { item } = this.props;
    return (
      <>
        <Wrapper>
          <SignupText isOk={true}>{item?.question_text}</SignupText>

          <form
            className="my-3"
            onSubmit={this.submitSitToStand}
            style={{ width: "440px" }}
          >
            {item?.allow_many
              ? item?.choices?.map((element) => {
                  return (
                    <Row>
                      <input
                        type="checkbox"
                        onChange={() => this.handleCheckboxChange(element.id)}
                        checked={this.state.option[`id${element.id}`]}
                      />

                      <label>{element.choice_text}</label>
                    </Row>
                  );
                })
              : item?.choices?.map((element) => {
                  return (
                    <Row>
                      <input
                        type="radio"
                        onChange={() =>
                          this.handleRadioButtonChange(element.id)
                        }
                        checked={this.state.option[`id`] === element.id}
                      />

                      <label>{element.choice_text}</label>
                    </Row>
                  );
                })}

            {!_isEmpty(this.state.option) ? (
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
