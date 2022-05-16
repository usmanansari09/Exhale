import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { facebook_link, linkedin_link, instagram_link } from '../../../utils/constants';
import './style.css';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <Container>
          <Row>
            <Col md={4} className="mt-5">
              <img className="logo" src={require('../../../assets/images/Logo2.png')} alt=" " />
              <h1 className="mt-2">Exchange to Change</h1>
              <p>
                An online pen pal exchange between students in the U.S. and Pakistan aimed to foster
                friendships, build relations, and dissolve cultural stereotypes
              </p>
              <div className="footer-social">
                <Link to={{ pathname: facebook_link }} target="_blank">
                  <img src={require('../../../assets/images/social-icons/facebook.png')} alt=" " />
                </Link>
                <Link to={{ pathname: linkedin_link }} target="_blank">
                  <img src={require('../../../assets/images/social-icons/linkedin.png')} alt=" " />
                </Link>
                <Link to={{ pathname: instagram_link }} target="_blank">
                  <img src={require('../../../assets/images/social-icons/instagram.png')} alt=" " />
                </Link>
              </div>
              <p>+1 (970) 456-5463</p>
              <p>
                macy.hopkinson@gmail.com
                <br /> exchangetochange.com
              </p>
            </Col>
            <Col md={{ span: 4, offset: 4 }} className="mt-5">
              <h1>Links</h1>
              <div className="footer-links">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about-us">About us</Link>
                  </li>
                  <li>
                    <Link to="/program-description">Program Description</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact us</Link>
                  </li>
                  {this.props.token ? (
                    ''
                  ) : (
                    <>
                      <li>
                        <Link to="/login"> Log in</Link>
                      </li>
                      <li>
                        <Link to="/signup"> Sign up</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>

        <Container fluid>
          <Row>
            <Col className="mb-3">
              <div className="copyrights">Copyright © 2020 PenPal™. All Rights Reserved.</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.auth.userToken,
  };
};

export default withRouter(connect(mapStateToProps)(Footer));
