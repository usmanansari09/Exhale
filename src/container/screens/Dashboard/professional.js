import React, { useEffect, useState, useCallback } from 'react';
import './../../../container/Layout/Dashboard/professional.css';
import Profile from './../../../assets/images/profile.png';
import exe from './../../../assets/images/exe.jpg';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loading } from '../../../redux/actions/loaderActions';
import { get_data } from './../../../redux/actions/product.js';
import { SignupButton } from '../../screens/LandingScreen/style';
import { emailValidator } from '../../../shared/validators/Validators';
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { getClientsList, inviteCLient, findClientsDetail } from '../../../apis/professionalApi';
import { Row, Col } from 'react-bootstrap';
import DynamicModal from '../../../components/Modal/DynamicModal';

const ProfessionalDashboard = ({ loading }) => {
  let [clientsList, setClientsList] = useState([]);
  let [clientDetail, setClientDetail] = useState(null);
  let [showModal, setShowModal] = useState(false);
  let [email, setEmail] = useState('');
  let [emailError, setEmailError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const getAllClients = useCallback(async () => {
    loading(true);
    let response = await getClientsList();
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
      loading(false);
      setClientsList(response.clients);
      setFilteredResults(response.clients);
    }
  }, [loading]);

  useEffect(() => {
    getAllClients();
  }, [getAllClients]);

  useEffect(() => {
    const filteredData = clientsList.filter((item) => {
      return Object.values(item.user).join('').toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredResults(filteredData);
  }, [searchInput, clientsList]);

  const onClickClient = async (id) => {
    loading(true);
    let response = await findClientsDetail(id);
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
      loading(false);
      setClientDetail(response);
    }

    console.log(findClientsDetail);
  };

  const submitInvites = async (e) => {
    e.preventDefault();
    let emailvalidator = await emailValidator(email);

    if (emailvalidator) setEmailError(emailvalidator);
    else {
      loading(true);
      let response = await inviteCLient({ email: email });
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
        loading(false);
        setShowModal(false);
        setEmail('');
        setEmailError('');
        succesSwal(response.message);
      }
    }
  };

  return (
    <div className="professional_wrapper">
      <p>Your Clients</p>

      <div className="main_card">
        <Row>
          <Col className="" md={6}>
            <div className="search_main">
              <span className="d-flex align-items-center w-100">
                <i className="fa fa-search"></i>
                <input
                  className="client_search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search client by email or name"
                ></input>
              </span>
              <button className="client_button" type="button" onClick={() => setShowModal(true)}>
                + Invite client
              </button>
            </div>
            <hr className="client_hr"></hr>

            <div className="client_list_main">
              {/* {searchInput.length > 1 ? (
                    filteredResults.map((data) => {
                        return (
                          <div key={data.id}>
                            <div className="client_content" onClick={() => onClickClient(data.id)}>
                              <h6>{data.user.name}</h6>
                              <h6 style={{color:'#707070'}}>{data.user.email}</h6>
                            </div>
                            <hr className="client_hr"></hr>
                          </div>
                        )
                    })
                ) : ( */}
              {filteredResults.map((data) => {
                return (
                  <div key={data.id}>
                    <div className="client_content" onClick={() => onClickClient(data.id)}>
                      <h6>{data.user.name}</h6>
                      <h6 style={{ color: '#707070' }}>{data.user.email}</h6>
                    </div>
                    <hr className="client_hr"></hr>
                  </div>
                );
              })}
              {/* )} */}
            </div>
          </Col>

          {clientDetail ? (
            <Col md={6}>
              <div className="client_profile">
                <img src={clientDetail.photo ? clientDetail.photo : Profile} alt="user pic" />
              </div>
              <h4 className="text-center"> {clientDetail.user.name}</h4>
              <h5 className="text-center themeMute">{clientDetail.user.email}</h5>
              <hr className="client_hr my-4"></hr>

              <div className="container client_profile_content">
                {/* detail block */}
                <Row className="my-4">
                  <Col className="my-3" md={6}>
                    <h6>Last sit-to-stand test result</h6>
                    <h6 className="themeMute">{clientDetail.last_sts.result}</h6>
                  </Col>
                  <Col className="my-3" md={6}>
                    <h6>Next sit-to-stand test date</h6>
                    <h6 className="themeMute">{clientDetail.next_sts_date}</h6>
                  </Col>
                  <Col className="my-3" md={6}>
                    <h6>Program Started</h6>
                    <h6 className="themeMute">{clientDetail.program_start}</h6>
                  </Col>
                  <Col className="my-3" md={6}>
                    <h6>Program finishes</h6>
                    <h6 className="themeMute">{clientDetail.program_end}</h6>
                  </Col>
                </Row>
                <hr className="client_hr my-4"></hr>
                {/* series block */}
                <Row className="my-4">
                  <Col className="my-3" md={6}>
                    <h6 className="mb-4">Exercise series</h6>
                    <div className="media">
                      <img className="mr-3" src={exe} alt="" />
                      <div className="media-body">
                        <h6>Day {clientDetail.current_exercise_series.day_number}</h6>
                        <h6 className="my-0 themeMute">
                          {clientDetail.current_exercise_series.series_name}
                        </h6>
                      </div>
                    </div>
                  </Col>
                  <Col className="my-3" md={6}>
                    <h6 className="mb-4">Classes series</h6>
                    <div className="media">
                      <img className="mr-3" src={exe} alt="" />
                      <div className="media-body">
                        <h6>Day {clientDetail.current_class_series.day_number}</h6>
                        <h6 className="my-0 themeMute">
                          {clientDetail.current_exercise_series.series_name}
                        </h6>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </div>

      {/* invite client modal */}
      <DynamicModal
        name="initeModal"
        isHidden={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        title="Invite client"
      >
        <Row className="mt-3">
          <Col xs={12} className="mt-2 mb-2">
            <label>Client's Name</label>
            <span className="position-relative">
              <input type="text" placeholder="Enter client name" name="clientName" maxLength="60" />
            </span>
          </Col>

          <Col xs={12} className="mt-2 mb-2">
            <label>Client's Email</label>
            <span className="position-relative">
              <input
                type="text"
                placeholder="Enter client email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength="60"
                required
              />
              {emailError && <span className="error">{emailError}</span>}
            </span>
          </Col>
        </Row>

        <Row className="justify-content-center mb-4">
          <Col xs={12}>
            <SignupButton
              style={{ width: '100%' }}
              type="submit"
              className="mt-4"
              onClick={submitInvites}
            >
              Invite
            </SignupButton>
            <SignupButton
              outline={true}
              style={{ width: '100%' }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </SignupButton>
          </Col>
        </Row>
      </DynamicModal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    dataList: state.app.listData,
    loading: state.loader.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_data: (data, history) => dispatch(get_data(data, history)),
    loading: (loadingStatus) => dispatch(loading(loadingStatus)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfessionalDashboard));
