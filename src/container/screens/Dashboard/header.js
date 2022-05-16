import React, { useEffect, useState, useCallback, useRef } from 'react';
import Profile from './../../../assets/images/profile.png';
import './../../Layout/Dashboard/header.css';
import { SignupButton } from '../../screens/LandingScreen/style';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AlertImage from './../../../assets/images/alert.png';
import { NavLink, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import CrossImage from './../../../assets/images/cross.png';
import InputImage from './../../../assets/images/Rectangle.png';
import InputIcon from './../../../assets/images/group-img.png';
import DragIcon from './../../../assets/images/drag.png';
import { set_data } from './../../../redux/actions/product.js';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { getUserProfile, editUserProfile } from '../../../apis/userApi';
import { NumberValidator } from '../../../shared/validators/Validators';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const HeaderPage = (props, set_data, app_name) => {
  const [show, setShow] = useState(false);
  const [profileImageEidt, setProfileImageEdit] = useState(false);
  const [initialTest, setInitialTest] = useState(false);

  const [profileChange, setProfileChange] = useState(false);
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [checkIndicator, setCheckIndicator] = useState(false);
  const [userProfileData, setUserProfileData] = useState([]);
  const [showAcc, setShowAcc] = useState(false);
  const handleCloseAcc = () => setShowAcc(false);
  const handleShowAcc = () => setShowAcc(true);
  let history = useHistory();
  let [profileName, setProfileName] = useState('yyyy');
  let [email, setEmail] = useState('');
  let [numberOfSits, setNumberOfSits] = useState('');
  let [nextSts, setNextSts] = useState('');

  let role = localStorage.getItem('role');

  const onSelectFile = (e) => {
    setCheckIndicator(true);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  function changeTrigger() {
    setCheckIndicator(false);
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleProfileImageClose = () => setProfileImageEdit(false);
  const handleProfileChangeOpen = () => setProfileChange(true);
  const handleProfileChangeClose = () => setProfileChange(false);
  const handleInitialTestClose = () => setInitialTest(false);
  const handleInitialTestOpen = () => setInitialTest(true);

  const handleProfileImageOpen = () => {
    setProfileImageEdit(true);
  };

  const getUserProfileData = async () => {
    let response = await getUserProfile();
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
      setUserProfileData(response.details);
      setProfileName(response.details.user.name);
      setNextSts(response.details.next_sts);

      let stsDate = new Date(response.details.next_sts_date);
      let currentDate = new Date();
      if (stsDate < currentDate || +currentDate === +stsDate) handleInitialTestOpen();
    }
  };

  const onsubmitSitups = async (e) => {
    e.preventDefault();
    let sitsValidator = await NumberValidator(numberOfSits);

    if (sitsValidator) {
      errorSwal('oops', sitsValidator);
    } else {
      let response = await editUserProfile({ [nextSts]: numberOfSits });
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
        handleInitialTestClose();
        succesSwal(response.message);
      }
    }
  };

  function logout() {
    setShow(false);
    window.localStorage.clear();
    history.push('/Landing');
    window.location.reload();
  }

  useEffect(() => {
    setProfileName(localStorage.getItem('firstName'));
    setEmail(localStorage.getItem('email'));
    // setRole(localStorage.getItem("role"));

    if (role === 'client') getUserProfileData();

    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCrop, role]);

  const updateUserProfile = async () => {
    var formdata = new FormData();
    formdata.append('user.name', profileName);
    // formdata.append("photo", fileInput.files[0], "male1.jpg");
    this.props.loading(true);
    let response = await editUserProfile(formdata);
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
      handleProfileChangeClose();
      this.props.loading(false);
      window.location.reload();
    }
  };

  function deletionAccount() {}

  return (
    <div>
      <div className="header__profile">
        <Navbar collapseOnSelect sticky="top" expand="lg">
          <Navbar.Brand className="" as={Link} to="/">
            <NavDropdown
              id="basic-nav-dropdown"
              title={
                <div className="header__img">
                  <img className="rounded-circle" src={Profile} width="50" alt="" />
                  <div className="online-indicator"></div>
                  <div className="header__title">
                    Hello, <span className="name">{profileName}</span>
                  </div>
                </div>
              }
            >
              {role === 'client' ? (
                <>
                  <NavDropdown.Item>
                    <div class="media">
                      <img class="media_imgIcon mr-3" src={Profile} alt="" />
                      <div class="media-body">
                        <h5 class="media-title mt-0">{profileName}</h5>
                        <h5 class="media-mute mt-0">{email}</h5>
                      </div>
                    </div>
                    <button
                      className="drop-btn"
                      variant="primary"
                      onClick={() => handleProfileImageOpen()}
                    >
                      <i className="fa fa-pencil mr-2"></i>Edit photo or name
                    </button>
                  </NavDropdown.Item>
                  <hr></hr>
                  <NavDropdown.Item>
                    <h5 className="media-mute mt-0" style={{ color: '#2E3034', fontWeight: 500 }}>
                      Next sit-to-stand test
                    </h5>
                    <h5 className="media-mute mt-0" style={{ fontSize: '16px' }}>
                      {userProfileData.next_sts_date}
                    </h5>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <h5 className="media-mute mt-3" style={{ color: '#2E3034', fontWeight: 500 }}>
                      Program Started
                    </h5>
                    <h5 className="media-mute mt-0" style={{ fontSize: '16px' }}>
                      {userProfileData.program_start}
                    </h5>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <h5 className="media-mute mt-3" style={{ color: '#2E3034', fontWeight: 500 }}>
                      Program finishes
                    </h5>
                    <h5 className="media-mute mt-0" style={{ fontSize: '16px' }}>
                      {userProfileData.program_end}
                    </h5>
                  </NavDropdown.Item>{' '}
                </>
              ) : (
                ''
              )}
            </NavDropdown>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav" className="mr-5">
            <Nav className="mr-auto mobile-menu">
              <NavLink className="nav-link" as={Link} to="/dashboard">
                Dashboard
              </NavLink>
              {role === 'client' ? (
                <>
                  <NavLink className="nav-link" as={Link} to="/dashboard/list">
                    Exercises
                  </NavLink>
                  <NavLink className="nav-link" as={Link} to="/dashboard/classesList">
                    Classes
                  </NavLink>
                </>
              ) : (
                ''
              )}
              <NavDropdown id="basic-nav-dropdown" title={`Account Settings`}>
                <NavDropdown.Item as={Link} to="/dashboard/policy">
                  Privacy Policy
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard/terms">
                  Terms Conditions
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard/policy">
                  Reset Password
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleShowAcc()}>Delete Account</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <div className="header__logout">
                <button className="logout-botton" onClick={() => handleShow()}>
                  Logout
                </button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      {/* log out modal */}
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal__body">
            <div>
              <img src={AlertImage} alt="" />
            </div>
            <div className="m-log">Log out</div>

            <div className="m-confirm">Are you sure you want to Log Out?</div>

            <div className="m-btns">
              <div className="c-btn" onClick={() => handleClose()}>
                <Button>Cancel</Button>
              </div>
              <div className="y-btn" onClick={() => logout()}>
                <Button>Yes</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* select file modal */}
      <Modal
        show={profileImageEidt}
        onHide={handleProfileImageClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="profile-img-edit"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="profile-modal-header">
              <div className="p-text">Edit photo or name</div>
              <div className="p-cross">
                <img src={CrossImage} alt="" onClick={() => handleProfileImageClose()} />
              </div>
            </div>
            <div className="modal-input">
              {checkIndicator === false ? (
                <div className="input-border">
                  <img src={InputImage} alt="" />
                  <div className="input-icon">
                    <label for="file-input">
                      <img
                        src={InputIcon}
                        alt=""
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                      />
                    </label>
                    <div className="drag-txt mute_clr">Drag and drop here</div>
                    <div className="mute_clr">or</div>
                    <div className="browse-txt">Browse files</div>
                  </div>
                </div>
              ) : (
                <div className="crop-imag-wrapper">
                  <div>
                    <ReactCrop
                      src={upImg}
                      onImageLoaded={onLoad}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                    />
                  </div>
                  <div>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                      }}
                    />
                  </div>
                  <div className="drag-text-wrapper">
                    <div>
                      <img src={DragIcon} alt="" />
                      <span className="d-txt">Drag to change the position of the photo</span>
                    </div>
                    <p className="change-p-text" onClick={() => changeTrigger()}>
                      Change photo
                    </p>
                  </div>
                  {/* <button
                    type="button"
                    disabled={!completedCrop?.width || !completedCrop?.height}
                    onClick={() =>
                      generateDownload(previewCanvasRef.current, completedCrop)
                    }
                  >
                    Download cropped image
                  </button> */}
                </div>
              )}

              <div className="mute_clr mt-3">Maximum file size: 8mb</div>
              <input id="file-input" type="file" accept="image/*" onChange={onSelectFile} />

              <div className="mt-4">
                <label>Full name</label>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  type="text"
                  placeholder="Update Name"
                />
              </div>

              <SignupButton
                type="submit"
                className="w-100 mt-5"
                onClick={() => handleProfileChangeOpen()}
              >
                Save
              </SignupButton>
              <SignupButton
                className="w-100 mt-3"
                outline={true}
                onClick={() => handleProfileImageClose()}
              >
                Cancel
              </SignupButton>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={profileChange}
        onHide={handleProfileChangeClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal__body">
            <div>
              <img src={AlertImage} alt="" />
            </div>
            <div className="m-log">You have made some changes</div>

            <div className="m-confirm">Are you sure you want to proceed without saving?</div>

            <div className="m-btns">
              <div className="c-btn" onClick={() => handleProfileChangeClose()}>
                <Button>Discard</Button>
              </div>
              <div className="y-btn" onClick={() => updateUserProfile()}>
                <Button onc>Save changes</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* modal on account delete */}
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

      {/* number of sis to stand modal */}
      <Modal
        show={initialTest}
        onHide={handleInitialTestClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="profile-img-edit"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="profile-modal-header">
              <div className="p-text">Edit sit to stand</div>
              <div className="p-cross">
                <img src={CrossImage} alt="" onClick={() => handleInitialTestClose()} />
              </div>
            </div>
            <div className="modal-input">
              <div className="mt-4">
                <label>Number of sit-to-stands</label>
                <input
                  value={numberOfSits}
                  onChange={(e) => setNumberOfSits(e.target.value)}
                  type="text"
                  placeholder="Enter the number"
                />
              </div>

              <SignupButton type="submit" className="w-100 mt-5" onClick={onsubmitSitups}>
                Save
              </SignupButton>
              <SignupButton
                className="w-100 mt-3"
                outline={true}
                onClick={() => handleInitialTestClose()}
              >
                Cancel
              </SignupButton>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderPage));
