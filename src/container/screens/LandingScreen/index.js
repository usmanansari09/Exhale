import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Header from '../../../container/Layout/Header';
import { Wrapper, Title1, SignupButton } from './style';

const LandingScreen = (props) => {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.history.push('/dashboard');
    }
    return () => {};
  }, [props]);

  return (
    <>
      <Header buttonText="signup" />
      <Wrapper>
        <Title1 isOk={true}>Wellcome to the first step to</Title1>
        <Title1>better lung health!</Title1>
        {/* <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        </Paragraph>
        <Paragraph className="mb-3">
          sed do eiusmod tempor incididunt ut labore et dolore
        </Paragraph> */}

        <Link from="/landing" to="/signup">
          <SignupButton className="mt-5">Sign up</SignupButton>
        </Link>
        <Link from="/landing" to="/professional-signup">
          <SignupButton outline={true}>Sign up as professional</SignupButton>
        </Link>
      </Wrapper>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loader.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingScreen));
