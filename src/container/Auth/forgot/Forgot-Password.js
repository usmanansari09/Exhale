import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { emailValidator } from '../../../shared/validators/Validators';
import { loading } from '../../../redux/actions/loaderActions';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { forgotPassword } from '../../../apis/authApi';

import styles from '../sign-in/login-style.module.css';

class Forgot_Password extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  ComponentDidMount = () => {
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

  click = async (e) => {
    e.preventDefault();
    let userEmail = this.state.email;
    let emailvalidator = await emailValidator(userEmail);
    if (emailvalidator) {
      this.setState({ emailErrors: emailvalidator });
    } else {
      this.props.loading(true);
      let response = await forgotPassword({
        email: this.state.email,
        password: this.state.password,
      });
      if (response.code === 400) {
        errorSwal('oops', response.message);
        this.props.loading(false);
      } else {
        this.props.loading(false);

        succesSwal(response.message);
        this.props.history.push('/login');
      }
    }
  };

  render() {
    return (
      <div className="position-relative">
        <div className="half-circle right-circle"></div>
        <div className="half-circle left-circle"></div>

        <div className={`container ${styles.page_main}`}>
          <h2 className="page-title">Forgot Password</h2>

          <form className="mt-5" onSubmit={this.click}>
            <div className="mb-3">
              <label>Email</label>
              <span className="position-relative">
                <input
                  type="email"
                  placeholder="Enter User Name"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  maxLength="60"
                  required
                />
                {this.state.emailErrors && <span className="error">{this.state.emailErrors}</span>}
              </span>
            </div>
            <button type="submit" className="button-default themeBtn">
              Submit
            </button>
          </form>
          <div className={styles.login_text}>
            Already have an account?
            <Link from="/forgot-password" to="/login">
              Login
            </Link>
          </div>
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
    loading: (loadingStatus) => {
      dispatch(loading(loadingStatus));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forgot_Password));
