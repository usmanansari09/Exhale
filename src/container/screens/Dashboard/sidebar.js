/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './../../Layout/Dashboard/sidebar.css';
import MenImage from './../../../assets/images/man.png';
import MenImage2 from './../../../assets/images/man2.png';
import HomeImage from './../../../assets/images/home.png';
import HomeImage2 from './../../../assets/images/home2.png';
import PersonImage from './../../../assets/images/person.png';
import SettingsImage from './../../../assets/images/settings.png';
import SettingsImage2 from './../../../assets/images/setting2.png';
import ArrowUp from './../../../assets/images/arrow-up.png';
import ArrowDown from './../../../assets/images/arrow-down.png';
import AlertImage from './../../../assets/images/alert.png';
import MobileLogo from './../../../assets/images/logom.png';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReactComponent as LogoSvg } from '../../../assets/svgs/logo.svg';
import { set_data } from './../../../redux/actions/product.js';
import { useHistory } from 'react-router-dom';

function Sidebar({ set_data, app_name }) {
  let history = useHistory();
  let [changeExer, setChangeExer] = useState(false);
  let [changeClass, setChangeClass] = useState(false);
  let [dashboardColor, setDashboardColor] = useState(true);
  let [accountSettingColor, setAccountSettingColor] = useState(false);
  let role = localStorage.getItem('role');

  const [showAcc, setShowAcc] = useState(false);
  const handleCloseAcc = () => setShowAcc(false);
  const handleShowAcc = () => setShowAcc(true);

  function closeCross() {
    set_data(false);
  }

  useEffect(() => {}, []);

  function changeDashboard() {
    history.push('/dashboard');
    setChangeExer(false);
    setChangeClass(false);
    setDashboardColor(true);
    setAccountSettingColor(false);
  }

  function changeExercise() {
    history.push('/dashboard/list');
    setChangeExer(true);
    setDashboardColor(false);
    setChangeClass(false);
    setAccountSettingColor(false);
  }

  function changeClassess() {
    history.push('/dashboard/classesList');
    setChangeClass(true);
    setDashboardColor(false);
    setChangeExer(false);
    setAccountSettingColor(false);
  }

  function changeAccSetting() {
    setDashboardColor(false);
    setChangeExer(false);
    setChangeClass(false);
    setAccountSettingColor(true);
  }

  function deletionAccount() {}

  return (
    <div className="sidebar-wapper">
      <Modal
        show={showAcc}
        onHide={handleCloseAcc}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal__body">
            <div>
              <img src={AlertImage} alt="" />
            </div>
            <div className="m-log">Delete account</div>

            <div className="m-confirm">Are you sure you want to Delete the Account?</div>

            <div className="m-btns">
              <div className="c-btn" onClick={() => handleCloseAcc()}>
                <Button>Cancel</Button>
              </div>
              <div className="y-btn" onClick={() => deletionAccount()}>
                <Button>Yes</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="sidebar-container ">
        <div className="cross-icon" onClick={() => closeCross()}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
        <div className="sidebar-logo">
          <LogoSvg className="logo-image" />
          {/* <div className="logo_text">LOGO</div> */}
        </div>
        <div className="sidebar-menues">
          <div
            className={dashboardColor ? `menue-list m1 ` : `menue-list m1 m-item1`}
            onClick={() => changeDashboard()}
          >
            <div>
              <img src={dashboardColor === false ? HomeImage : HomeImage2} alt="" />
            </div>
            <div className={dashboardColor === false ? `text d-text m-text` : `text d-text `}>
              Dashboard
            </div>
          </div>

          {role === 'client' ? (
            <>
              <div
                className={changeExer ? `menue-list m1 m-item2 b-color` : `menue-list m1 m-item2`}
                onClick={() => changeExercise()}
              >
                <div>
                  <img src={changeExer ? MenImage2 : MenImage} alt="" />
                </div>
                <div
                  className={changeExer ? `text d-text m-text text-color ` : `text d-text m-text`}
                >
                  Exercises
                </div>
              </div>

              <div
                className={changeClass ? `menue-list m1 m-item2 b-color` : `menue-list m1 m-item2`}
                onClick={() => changeClassess()}
              >
                <div>
                  <img src={changeClass ? MenImage2 : MenImage} alt="" />
                </div>
                <div
                  className={changeClass ? `text d-text m-text text-color ` : `text d-text m-text`}
                >
                  Classes
                </div>
              </div>
            </>
          ) : (
            ''
          )}
          <div
            className={
              accountSettingColor ? `menue-list m1 m-item2 b-color` : `menue-list m1 m-item2`
            }
            onClick={() => changeAccSetting()}
          >
            <div>
              <img
                src={accountSettingColor ? SettingsImage2 : SettingsImage}
                alt=""
                className="setting_img"
              />
            </div>
            <div
              className={
                accountSettingColor ? `text d-text m-text text-color` : `text d-text m-text `
              }
            >
              Account Settings
            </div>
            <div>
              <img className="setting-img" src={accountSettingColor ? ArrowUp : ArrowDown} alt="" />
            </div>
          </div>
        </div>
        {accountSettingColor ? (
          <div className="setting_options">
            <div className="s_opt_item" onClick={() => history.push('/dashboard/policy')}>
              <div className="circle"></div>
              <div className="b-circle"></div>
              <p>Privacy Policy</p>
            </div>
            <div className="s_opt_item" onClick={() => history.push('/dashboard/terms')}>
              <div className="circle"></div>
              <div className="b-circle"></div>
              <p>Terms & Conditions</p>
            </div>
            <div className="s_opt_item">
              <div className="circle"></div>
              <div className="b-circle"></div>
              <p>Reset Password</p>
            </div>
            <div className="s_opt_item">
              <div className="circle"></div>
              <div className="b-circle"></div>
              <p>Sign Out</p>
            </div>
            <div className="s_opt_item" onClick={() => handleShowAcc()}>
              <div className="circle"></div>
              <div className="b-circle"></div>
              <p>Delete Account</p>
            </div>
          </div>
        ) : null}
      </div>
      {app_name.app_trigger ? (
        <div className="sidebar-container-m ">
          <div className="cross-icon" onClick={() => closeCross()}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </div>
          <div className="sidebar-logo">
            <img src={MobileLogo} alt="" className="logo-image" />
            <div className="logo_text">LOGO</div>
          </div>
          <div className="sidebar-menues">
            <div
              className={dashboardColor ? `menue-list m1 ` : `menue-list m1 m-item1`}
              onClick={() => changeDashboard()}
            >
              <div>
                <img src={dashboardColor === false ? HomeImage : HomeImage2} alt="" />
              </div>
              <div className={dashboardColor === false ? `text d-text m-text` : `text d-text `}>
                Dashboard
              </div>
            </div>
            <div
              className={changeExer ? `menue-list m1 m-item2 b-color` : `menue-list m1 m-item2`}
              onClick={() => changeExercise()}
            >
              <div>
                <img src={changeExer ? MenImage2 : MenImage} alt="" />
              </div>
              <div className={changeExer ? `text d-text m-text text-color ` : `text d-text m-text`}>
                Exercises
              </div>
            </div>
            <div className="menue-list m1 m-item2">
              <div>
                <img src={PersonImage} alt="" />
              </div>
              <div className="text d-text m-text">Classes</div>
            </div>
            <div
              className={
                accountSettingColor ? `menue-list m1 m-item2 b-color` : `menue-list m1 m-item2`
              }
              onClick={() => changeAccSetting()}
            >
              <div>
                <img
                  src={accountSettingColor ? SettingsImage2 : SettingsImage}
                  alt=""
                  className="setting_img"
                />
              </div>
              <div
                className={
                  accountSettingColor ? `text d-text m-text text-color` : `text d-text m-text `
                }
              >
                Account Settings
              </div>
              <div>
                <img
                  className="setting-img"
                  src={accountSettingColor ? ArrowUp : ArrowDown}
                  alt=""
                />
              </div>
            </div>
          </div>
          {accountSettingColor ? (
            <div className="setting_options">
              <div className="s_opt_item" onClick={() => history.push('/dashboard/policy')}>
                <div className="circle"></div>
                <div className="b-circle"></div>
                <p>Privacy Policy</p>
              </div>
              <div className="s_opt_item" onClick={() => history.push('/dashboard/terms')}>
                <div className="circle"></div>
                <div className="b-circle"></div>
                <p>Terms & Conditions</p>
              </div>
              <div className="s_opt_item">
                <div className="circle"></div>
                <div className="b-circle"></div>
                <p>Reset Password</p>
              </div>
              <div className="s_opt_item">
                <div className="circle"></div>
                <div className="b-circle"></div>
                <p>Sign Out</p>
              </div>
              <div className="s_opt_item" onClick={() => handleShowAcc()}>
                <div className="circle"></div>
                <div className="b-circle"></div>
                <p>Delete Account</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    app_name: state.app,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_data: (data, history) => dispatch(set_data(data, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
