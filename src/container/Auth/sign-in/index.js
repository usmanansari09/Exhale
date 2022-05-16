import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Header from '../../../container/Layout/Header';

import { emailValidator, TextValidator } from '../../../shared/validators/Validators';
import { loginUser, resetPassword, OTP } from '../../../apis/authApi';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { setUserFirstName, authToken, authData } from '../../../redux/actions/authActions';
import { loading } from '../../../redux/actions/loaderActions';

import { SignupText, SignupButton } from '../../screens/LandingScreen/style';
import { Col, Row } from 'react-bootstrap';
import styles from './login-style.module.css';
import DynamicModal from '../../../components/Modal/DynamicModal';

import { UserInput } from '../../../components';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      resetEmail: '',

      password: '',
      otp: '',
      show_hide: false,
      showModal: false,
      showOTPModal: false,
    };
  }

  componentDidMount = () => {
    document.getElementById('root').scrollIntoView();
    this.checkToken();
  };

  checkToken = () => {
    if (localStorage.getItem('token')) {
      this.props.history.push('/dashboard');
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitForm = async (event) => {
    event.preventDefault();
    let userEmail = this.state.email;
    let emailvalidator = await emailValidator(userEmail);

    if (emailvalidator) this.setState({ emailErrors: emailvalidator });
    else this.onSubmitLogin();
  };

  onSubmitLogin = async () => {
    this.props.loading(true);
    let response = await loginUser({
      email: this.state.email,
      password: this.state.password,
    });

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
      succesSwal(response.message);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('token', response.token);
      localStorage.setItem('firstName', response.user.name);
      localStorage.setItem('role', response.type);

      this.props.setFirstName(response.user.name);
      this.props.setToken(response.token);

      if (response.type === 'professional') {
        this.props.history.push('/dashboard');
      } else {
        response.questionnaire_completed
          ? this.props.history.push('/dashboard')
          : this.props.history.push('/initial-assesment');
      }
    }
  };

  submitResetPassword = async (e) => {
    e.preventDefault();
    let userEmail = this.state.resetEmail;
    let emailvalidator = await emailValidator(userEmail);
    if (emailvalidator) {
      this.setState({ resetEmailErrors: emailvalidator });
    } else {
      this.props.loading(true);
      let response = await resetPassword({ email: this.state.resetEmail });
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
        this.setState({ showModal: false });
        this.setState({ showOTPModal: true });
        succesSwal(response.message);
      }
    }
  };

  submitOTP = async (e) => {
    e.preventDefault();
    let userOTP = this.state.otp;
    let otpvalidator = await TextValidator(userOTP);
    if (otpvalidator) {
      this.setState({ otpErrors: otpvalidator });
    } else {
      this.props.loading(true);
      let response = await OTP({
        email: this.state.resetEmail,
        otp: this.state.otp,
      });
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
        this.setState({ showOTPModal: false });
        succesSwal(response.otp);
      }
    }
  };

  clearState = () => {
    this.setState({
      email: '',
      password: '',
      emailErrors: '',
      passwordError: '',
      show_hide: false,
      showOTPModal: false,
    });
  };

  changeShowHide = () => {
    const hideShow = this.state.show_hide;
    if (hideShow) {
      this.setState({ show_hide: false });
    } else {
      this.setState({ show_hide: true });
    }
  };

  render() {
    return (
      <div className="position-relative">
        <Header />
        <div className={`container ${styles.page_main}`}>
          <Row className="justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <SignupText isOk={true}>
                Sign in to <span style={{ color: '#eab105' }}>Exhale</span>
              </SignupText>

              <form className="mt-5" onSubmit={this.submitForm}>
                <Row>
                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      label={'Email'}
                      error={this.state.emailErrors}
                      placeholder="Enter your email"
                      name="email"
                      value={this.state.email}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ emailErrors: '' });
                      }}
                      maxLength="60"
                      required
                    />
                  </Col>
                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      required
                      label={'Password'}
                      placeholder="Enter your Password"
                      name="password"
                      maxLength="30"
                      type={this.state.show_hide ? 'text' : 'password'}
                      error={this.state.passwordError}
                      value={this.state.password}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ passwordError: '' });
                      }}
                      icon={
                        <i
                          className={
                            this.state.show_hide
                              ? 'hide-show fa fa-eye'
                              : 'hide-show fa fa-eye-slash'
                          }
                          onClick={() => this.setState({ show_hide: !this.state.show_hide })}
                        />
                      }
                    />
                  </Col>
                  <Col xs={12} className="mt-2">
                    <div className="d-flex justify-content-between mt-4">
                      <span>
                        <input type="checkbox" value="lsRememberMe" id="rememberMe" />
                        <label className={`ml-3 ${styles.remember_label}`} htmlFor="rememberMe">
                          Remember me
                        </label>
                      </span>
                      <span
                        className={styles.forgotText}
                        onClick={() => {
                          this.setState({ showModal: true });
                        }}
                      >
                        Forgot password?
                      </span>
                    </div>
                    <SignupButton style={{ width: '100%' }} type="submit" className="mt-4">
                      Sign in
                    </SignupButton>

                    <div className={styles.login_text}>
                      Don’t have an account?
                      <Link from="/login" to="/signup">
                        Sign up
                      </Link>
                      here
                    </div>
                  </Col>
                </Row>
              </form>
            </div>
          </Row>
        </div>

        {/* Reset password email modal */}
        <DynamicModal
          name="editModal"
          isHidden={this.state.showModal}
          onClose={() => this.setState({ showModal: false })}
          size="md"
          title="Reset password"
        >
          <Row className="mt-3">
            <Col xs={12} className="mt-2 mb-2">
              <label>Email ID</label>
              <span className="position-relative">
                <input
                  type="text"
                  placeholder="Enter your email ID"
                  name="resetEmail"
                  value={this.state.resetEmail}
                  onChange={this.handleChange}
                  maxLength="60"
                  required
                />
                {this.state.resretEmailErrors && (
                  <span className="error">{this.state.resretEmailErrors}</span>
                )}
              </span>
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col xs={12}>
              <SignupButton
                style={{ width: '100%' }}
                type="submit"
                className="mt-4"
                onClick={this.submitResetPassword}
              >
                Reset password
              </SignupButton>
              <SignupButton
                outline={true}
                style={{ width: '100%' }}
                onClick={() => this.setState({ showModal: false })}
              >
                Cancel
              </SignupButton>
            </Col>
          </Row>
        </DynamicModal>

        {/* OTP modal */}
        <DynamicModal
          name="otpModal"
          isHidden={this.state.showOTPModal}
          onClose={() => this.setState({ showOTPModal: false })}
          size="md"
          title="Reset Password"
        >
          <Row>
            <Col xs={12} style={{ color: '#717273' }}>
              this.props.onCloseLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} className="mt-2 mb-2">
              <label>OTP</label>
              <span className="position-relative">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  value={this.state.otp}
                  onChange={this.handleChange}
                  maxLength="60"
                  required
                />
                {this.state.otpErrors && <span className="error">{this.state.otpErrors}</span>}
              </span>
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col xs={12}>
              <SignupButton
                style={{ width: '100%' }}
                type="submit"
                className="mt-4"
                onClick={this.submitOTP}
              >
                Submit
              </SignupButton>
              <SignupButton
                outline={true}
                style={{ width: '100%' }}
                onClick={() => this.setState({ showOTPModal: false })}
              >
                Cancel
              </SignupButton>
            </Col>
          </Row>
        </DynamicModal>

        {/* Reset Password fields modal */}
        <DynamicModal
          name="passwordModal"
          isHidden={this.state.showPasswordModal}
          onClose={() => this.setState({ showPasswordModal: false })}
          size="md"
          title="Set new Password"
        >
          <Row className="mt-3">
            <Col xs={12} className="mt-2 mb-2">
              <UserInput
                required
                label={'Password'}
                placeholder="Enter your Password"
                name="resetPassword"
                maxLength="30"
                type={this.state.resetShow_hide ? 'text' : 'password'}
                error={this.state.resetPasswordError}
                value={this.state.resetPassword}
                onChange={(e) => {
                  this.handleChange(e);
                  this.setState({ resetPasswordError: '' });
                }}
                icon={
                  <i
                    className={
                      this.state.resetShow_hide
                        ? 'hide-show fa fa-eye'
                        : 'hide-show fa fa-eye-slash'
                    }
                    onClick={() =>
                      this.setState({
                        resetShow_hide: !this.state.resetShow_hide,
                      })
                    }
                  />
                }
              />
            </Col>

            <Col xs={12} className="mt-2 mb-2">
              <UserInput
                required
                label={'Confirm Password'}
                placeholder="Re-Enter your Password"
                name="resetConfirmPassword"
                maxLength="30"
                type={this.state.resetShow_hide1 ? 'text' : 'password'}
                error={this.state.resetPasswordError1}
                value={this.state.resetConfirmPassword}
                onChange={(e) => {
                  this.handleChange(e);
                  this.setState({ resetPasswordError1: '' });
                }}
                icon={
                  <i
                    className={
                      this.state.resetShow_hide1
                        ? 'hide-show fa fa-eye'
                        : 'hide-show fa fa-eye-slash'
                    }
                    onClick={() =>
                      this.setState({
                        resetShow_hide1: !this.state.resetShow_hide1,
                      })
                    }
                  />
                }
              />
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col xs={12}>
              <SignupButton
                style={{ width: '100%' }}
                type="submit"
                className="mt-4"
                onClick={this.submitNewPassword}
              >
                Submit
              </SignupButton>
              <SignupButton
                outline={true}
                style={{ width: '100%' }}
                onClick={() => this.setState({ showPasswordModal: false })}
              >
                Cancel
              </SignupButton>
            </Col>
          </Row>
        </DynamicModal>
      </div>
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
    setToken: (token) => {
      dispatch(authToken(token));
    },
    setFirstName: (firstName) => {
      dispatch(setUserFirstName(firstName));
    },
    setLoginData: (loginData) => {
      dispatch(authData(loginData));
    },
    loading: (loadingStatus) => {
      dispatch(loading(loadingStatus));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
