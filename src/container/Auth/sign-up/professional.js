import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  TextValidator,
} from '../../../shared/validators/Validators';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { UserInput } from '../../../components/';

import { setUserFirstName, authToken, authData } from '../../../redux/actions/authActions';
import { loading } from '../../../redux/actions/loaderActions';
import { signupProfessional } from '../../../apis/authApi';
import Header from '../../../container/Layout/Header';

import styles from '../sign-in/login-style.module.css';
import { SignupText, SignupButton } from '../../screens/LandingScreen/style';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      business_name: '',
      business_id: '',
      email: '',
      password: '',
      confirmPassword: '',
      show_hide: false,
      show_hide2: false,
    };
  }

  componentDidMount = () => {
    document.getElementById('root').scrollIntoView();
    this.checkToken();
  };

  checkToken = () => {
    if (localStorage.getItem('token')) {
      this.props.history.push('/initial-assesment');
    }
  };

  changeShowHide = () => {
    const hideShow = this.state.show_hide;
    if (hideShow) {
      this.setState({ show_hide: false });
    } else {
      this.setState({ show_hide: true });
    }
  };

  changeShowHide2 = () => {
    const hideShow = this.state.show_hide2;
    if (hideShow) {
      this.setState({ show_hide2: false });
    } else {
      this.setState({ show_hide2: true });
    }
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  checkValidation = async (e) => {
    e.preventDefault();
    let errorStatus = false;

    let nameValidator = await TextValidator(this.state.fullName);
    let businessValidator = await TextValidator(this.state.business_name);
    let idValidator = await TextValidator(this.state.business_id);
    let emailvalidator = await emailValidator(this.state.email);
    let passwordvalidator = await passwordValidator(this.state.password);
    let confirmPassValidator = await confirmPasswordValidator(
      this.state.password,
      this.state.confirmPassword
    );

    if (nameValidator) {
      this.setState({ nameError: nameValidator });
      errorStatus = true;
    }
    if (businessValidator) {
      this.setState({ nameError: businessValidator });
      errorStatus = true;
    }
    if (idValidator) {
      this.setState({ nameError: idValidator });
      errorStatus = true;
    }
    if (emailvalidator) {
      this.setState({ emailError: emailvalidator });
      errorStatus = true;
    }
    if (passwordvalidator) {
      this.setState({ passwordError: passwordvalidator });
      errorStatus = true;
    }
    if (confirmPassValidator) {
      this.setState({ confirmPasswordError: confirmPassValidator });
      errorStatus = true;
    }

    if (!errorStatus) {
      this.submitSignup();
    }
  };

  submitSignup = async () => {
    this.props.loading(true);
    let response;

    response = await signupProfessional({
      email: this.state.email,
      password: this.state.password,
      name: this.state.fullName,
      professional: {
        business_name: this.state.business_name,
        business_id: this.state.business_id,
      },
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

      localStorage.setItem('token', response.token);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('firstName', response.user.name);
      localStorage.setItem('role', 'professional');

      this.props.setFirstName(response.user.name);
      this.props.setToken(response.token);

      this.props.history.push('/dashboard');
    }
  };

  render() {
    return (
      <div className="position-relative">
        <Header buttonText="signup" />
        <div className={`container ${styles.page_main}`} style={{ width: '100%' }}>
          <Row className="justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <SignupText isOk={true}>
                Sign up to <span style={{ color: '#eab105' }}>Exhale</span>
              </SignupText>
              <form className="mt-4" onSubmit={this.checkValidation}>
                <Row>
                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      label={'Full Name'}
                      error={this.state.nameError}
                      placeholder="Enter Your Full Name"
                      name="fullName"
                      value={this.state.fullName}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ nameError: '' });
                      }}
                      maxLength="50"
                      required
                    />
                  </Col>
                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      label={'Business/Professional Name'}
                      error={this.state.nameError}
                      placeholder="Enter Your Name"
                      name="business_name"
                      value={this.state.business_name}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ businessError: '' });
                      }}
                      maxLength="50"
                      required
                    />
                  </Col>
                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      label={'Business/Professional ID'}
                      error={this.state.nameError}
                      placeholder="Enter Your ID"
                      name="business_id"
                      value={this.state.business_id}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ idError: '' });
                      }}
                      maxLength="50"
                      required
                    />
                  </Col>
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

                  <Col xs={12} className="mt-2 mb-2">
                    <UserInput
                      required
                      label={'Confirm Password'}
                      type={this.state.show_hide2 ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      maxLength="30"
                      error={this.state.confirmPasswordError}
                      onChange={(e) => {
                        this.handleChange(e);
                        this.setState({ passwordError: '' });
                      }}
                      icon={
                        <i
                          className={
                            this.state.show_hide2
                              ? 'hide-show fa fa-eye'
                              : 'hide-show fa fa-eye-slash'
                          }
                          onClick={() =>
                            this.setState({
                              show_hide2: !this.state.show_hide2,
                            })
                          }
                        />
                      }
                    />
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col xs={12} className="mt-2">
                    <div className="my-3">
                      <input type="checkbox" value="lsRememberMe" id="rememberMe" />
                      <label className={`ml-3 ${styles.remember_label}`} htmlFor="rememberMe">
                        I agree with
                      </label>
                      <Link className="pl-1" from="/signup" to="/termsandcondition">
                        Terms and Conditions
                      </Link>
                    </div>

                    <SignupButton style={{ width: '100%' }} type="submit" className="mt-4">
                      Sign up
                    </SignupButton>
                  </Col>
                </Row>
              </form>
            </div>
          </Row>
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
