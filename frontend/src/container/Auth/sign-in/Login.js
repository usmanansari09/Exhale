import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import Header from "../../../container/Layout/Header";

import {
  emailValidator,
  TextValidator,
  passwordValidator,
} from "../../../shared/validators/Validators";
import { loginUser, resetPassword, OTP } from "../../../apis/authApi";
import { succesSwal, errorSwal } from "../../../components/swal/Swal";
import {
  setUserFirstName,
  authToken,
  authData,
} from "../../../redux/actions/authActions";
import { loading } from "../../../redux/actions/loaderActions";

import { SignupText, SignupButton } from "../../screens/LandingScreen/style";
import { Col, Row } from "react-bootstrap";
import styles from "./login-style.module.css";
import DynamicModal from "../../../components/Modal/DynamicModal";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      resetEmail: "",

      password: "",
      otp: "",
      show_hide: false,
      showModal: false,
      showOTPModal: false,
    };
  }

  componentDidMount = () => {
    document.getElementById("root").scrollIntoView();
    this.checkToken();
  };

  checkToken = () => {
    if (localStorage.getItem("token")) {
      this.props.history.push("/dashboard");
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitForm = async (event) => {
    event.preventDefault();

    let userEmail = this.state.email;
    let userPassword = this.state.password;
    let emailvalidator = await emailValidator(userEmail);
    let passwordvalidator = await passwordValidator(userPassword);

    if (emailvalidator) this.setState({ emailErrors: emailvalidator });
    else if (passwordvalidator)
      this.setState({ passwordError: passwordvalidator });
    else this.onSubmitLogin();
  };

  onSubmitLogin = async () => {
    this.props.loading(true);
    let response = await loginUser({
      email: this.state.email,
      password: this.state.password,
    });

    if (response.status === 400) {
      response = await response.json();
      errorSwal("oops", response.message);
      this.props.loading(false);
    } else if (response.status === 200) {
      response = await response.json();
      this.props.loading(false);
      succesSwal(response.message);
      localStorage.setItem("token", response.token);
      localStorage.setItem("firstName", response.user.name);
      this.props.setFirstName(response.user.name);
      this.props.setToken(response.token);

      this.props.history.push("/dashboard");
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
      if (response.status === 400) {
        response = await response.json();
        errorSwal("oops", response.message);
        this.props.loading(false);
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
      if (response.status === 400) {
        response = await response.json();
        errorSwal("oops", response.message);
        this.props.loading(false);
      } else if (response.status === 201) {
        response = await response.json();
        this.props.loading(false);
        this.setState({ showOTPModal: false });
        succesSwal(response.message);
      }
    }
  };

  clearState() {
    this.setState({
      email: "",
      password: "",
      emailErrors: "",
      passwordError: "",
      show_hide: false,
      showOTPModal: false,
    });
  }

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
                Sign in to <span style={{ color: "#eab105" }}>Exhale</span>
              </SignupText>

              <form className="mt-5" onSubmit={this.submitForm}>
                <Row>
                  <Col xs={12} className="mt-2 mb-2">
                    <label>Email</label>
                    <span className="position-relative">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        maxLength="60"
                        required
                      />
                      {this.state.emailErrors && (
                        <span className="error">{this.state.emailErrors}</span>
                      )}
                    </span>
                  </Col>
                  <Col xs={12} className="mt-2 mb-2">
                    <label>Password</label>
                    <span className="position-relative">
                      <input
                        type={this.state.show_hide ? "text" : "password"}
                        placeholder="Enter your Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        maxLength="30"
                        required
                      />
                      <i
                        className={
                          this.state.show_hide
                            ? "hide-show fa fa-eye"
                            : "hide-show fa fa-eye-slash"
                        }
                        onClick={this.changeShowHide}
                      ></i>
                    </span>
                    {this.state.passwordError && (
                      <span className="error">{this.state.passwordError}</span>
                    )}
                  </Col>
                  <Col xs={12} className="mt-2">
                    <div className="d-flex justify-content-between mt-4">
                      <span>
                        <input
                          type="checkbox"
                          value="lsRememberMe"
                          id="rememberMe"
                        />
                        <label
                          className={styles.remember_label}
                          htmlFor="rememberMe"
                        >
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
                    <SignupButton
                      style={{ width: "100%" }}
                      type="submit"
                      className="mt-4"
                    >
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

        {/* Reset password modal */}
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
                style={{ width: "100%" }}
                type="submit"
                className="mt-4"
                onClick={this.submitResetPassword}
              >
                Reset password
              </SignupButton>
              <SignupButton
                outline={true}
                style={{ width: "100%" }}
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
            <Col xs={12} style={{ color: "#717273" }}>
              this.props.onCloseLorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt
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
                {this.state.otpErrors && (
                  <span className="error">{this.state.otpErrors}</span>
                )}
              </span>
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col xs={12}>
              <SignupButton
                style={{ width: "100%" }}
                type="submit"
                className="mt-4"
                onClick={this.submitOTP}
              >
                Submit
              </SignupButton>
              <SignupButton
                outline={true}
                style={{ width: "100%" }}
                onClick={() => this.setState({ showOTPModal: false })}
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
