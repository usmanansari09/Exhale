import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loading } from '../../../../redux/actions/loaderActions';
// import { postQuestionnaire } from "../../../../apis/authApi";

import { Wrapper, SignupButton, SignupText } from '../style';

class InitialScreen extends Component {
  submit = async (e) => {
    e.preventDefault();
    console.log(this.props.optionValues);
    // let response = await postQuestionnaire({
    //   choices: [
    //     {
    //       id: 2,
    //     },
    //     {
    //       id: 6,
    //     },
    //     {
    //       id: 11,
    //     },
    //   ],
    // });
    // console.log(response);
    // let errorStatus = false;

    // let sitsValidator = await sitToStandValidator(this.state.numberOfSits);

    // if (sitsValidator) {
    //   this.setState({ sitsError: sitsValidator });
    //   // errorStatus = true;
    // } else {

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

  render() {
    return (
      <>
        <Wrapper>
          <SignupText isOk={true}>Submit result</SignupText>

          <form className="my-3" onSubmit={this.submit} style={{ width: '440px' }}>
            <SignupButton type="submit" className={'w-100 mt-4'}>
              Submit
            </SignupButton>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InitialScreen));
