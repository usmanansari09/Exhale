import React, { Component } from "react";
import Stepper from 'react-js-stepper'
import Input from '../../components/input/Input';
import { Row } from "react-bootstrap";
import { agesList } from "../../shared/data";
import { emailValidator, NumberValidator, passwordValidator, TextValidator} from '../../shared/validators/Validators';

import './style.css';

const steps = [{title: 'No. Of Student'}, {title: 'Set Name'}, {title: 'Set Userame'}, {title: 'Set Password'}]
const ageList = agesList();

class pageStepper extends Component {
  constructor(props) {
    super(props);

    this.state = {
        activeStep          : 1,
        inputList:[],
        numberOfParticipate :''
    }
  }

  // handle participate input change
  handleChange=(event)=> {
  this.setState(
    {
      [event.target.name]: event.target.value,
      [`${event.target.name}Error`]: ''
    }
  );

  }

  // handle click event of the Add number of fields on the base of number of participant entered
  handleAddClick = () => {
  this.setState({inputList:[]});
  for(let i=0; i < this.state.participate; i++)
  {
    this.setState({inputList:[...this.state.inputList, { firstName: "", lastName: "", email: "", age: "7", userName:"", password:"" }]});
  }

  };

  // handle input change
  handleInputChange = (e, index) => {
  const { name, value } = e.target;
  const list =  this.state.inputList;
  list[index][name] = value;
  list[index][`${name}Error`] = '';
  this.setState({inputList:list})
  };

  // handle input validation
  checkValidations = async() => 
  {
  let errorStatus = false;

  if(this.state.activeStep === 1)
  {
    let participateValidator  = await NumberValidator(this.state.participate);
    if(participateValidator)
    {
      this.setState({participateError:participateValidator})
      errorStatus = true;
    }
    else
    {
      this.handleAddClick();
    }
  }

  else if(this.state.activeStep === 2 || this.state.activeStep === 3 || this.state.activeStep === 4 )
  {
    if(this.multipleUsersValidations()===true)
      errorStatus = true;
  }

  if(!errorStatus)
  {
    if(this.state.activeStep === 4)
    {
      this.props.userList(this.state.inputList);
    }
    else
    {
      this.handleOnClickNext();
    }
  }

  }

  // handle validation of multiple number of fields
  multipleUsersValidations = () => {
  let errorStatus=false; 
  const list =  this.state.inputList;
  list.forEach (element => {
    if(this.state.activeStep === 2)
    {
      let firstNameValidator  =  TextValidator(element.firstName);
      let lastNameValidator   =  TextValidator(element.lastName);
      let emailvalidator      =  emailValidator(element.email);
      if(firstNameValidator)
      {
        element.firstNameError = firstNameValidator;
        errorStatus = true;
      }
      if(lastNameValidator)
      {
        element.lastNameError = lastNameValidator;
        errorStatus = true;
      }

      if(emailvalidator)
      {
        element.emailError = emailvalidator;
        errorStatus = true;
      }

      if(!errorStatus)
      {
        element.userName = `${element.firstName}${element.lastName}`;
        let val = Math.floor(1000 + Math.random() * 9000);
        element.password = `${element.firstName.slice(0,1).toUpperCase()}${element.lastName.slice(0,1)}${element.lastName.slice(1,2).toLowerCase()}${val}$`;
      }

    }
    else if(this.state.activeStep === 3)
    {
      let userNameValidator  =  TextValidator(element.userName);
      if(userNameValidator)
      {
        element.userNameError = userNameValidator;
        errorStatus = true;
      }
    }
    else
    {
      let PasswordValidator  =  passwordValidator(element.password);
      if(PasswordValidator)
      {
        element.passwordError = PasswordValidator;
        errorStatus = true;
      }
    } 
  });

  this.setState({inputList:list});

  return errorStatus;
  } 

  handleOnClickStepper = (step) => {
    this.setState({activeStep: step});
  }

  handleOnClickNext = () => {
    let nextStep = this.state.activeStep + 1;
    this.setState({activeStep: nextStep})
  }

  handleOnClickBack = () => {
    let prevStep = this.state.activeStep - 1;
    this.setState({activeStep:prevStep})
  }

  render(){
    return(
        <React.Fragment>
            <Stepper 
                steps={steps} 
                activeStep={this.state.activeStep}
                onSelect={this.checkValidations}
                showNumber={false} 
            />

            <div style={{marginTop: '40px',borderTop: '1px solid #e9ecef', paddingTop: '1rem'}}>
            {this.state.activeStep === 1 ? 
              <div> 
                <Row>
                    <div className="col-12 mt-2 mb-2">
                        <label>How many students will participate in this exchange?</label>
                        <Input type="text" placeholder="" name="participate" value={this.state.participate}
                          onChange={this.handleChange} maxLength="10" error={this.state.participateError} autoComplete="none" required/>
                    </div>
                </Row>
              </div> 
              : 
              this.state.activeStep === 2 ? 
              <div>
                {this.state.inputList.map( (i,index) => {

                  return (
                    <Row className="position-relative mx-2" key={index}>
                      <span className="projectCounter">{index + 1}</span>

                      <div className="col-md-6 mt-2 mb-2">
                          <label>First Name</label>
                          <Input type="text" placeholder="" name="firstName" value={i.firstName}
                            onChange={(e) => this.handleInputChange(e, index)} maxLength="30" error={i.firstNameError} required/>
                      </div>

                      <div className="col-md-6 mt-2 mb-2">
                          <label >Last Name</label>
                          <Input type="text" placeholder="" name="lastName" value={i.lastName}
                            onChange={(e) => this.handleInputChange(e, index)} maxLength="30" error={i.lastNameError} required/>
                      </div>

                      <div className="col-md-9 mt-2 mb-2">
                          <label >Email</label>
                          <Input type="text" placeholder="" name="email" value={i.email}
                            onChange={(e) => this.handleInputChange(e, index)} maxLength="60" error={i.emailError} required />
                      </div>

                      <div className="col-md-3 mt-2 mb-2">
                          <label >Age</label>
                          <select name='age' value={i.age} onChange={(e) => this.handleInputChange(e, index)}>
                          { ageList.map(({ value, label }, index) => <option key={index} value={value}>{label}</option>)} 
                              {/* <option>7</option>
                              <option>8</option>
                              <option>19</option> */}
                          </select>
                      </div>

                    </Row>
                  )
                })}
                
              </div> 
              :
              this.state.activeStep === 3 ? 
              <div>
                {this.state.inputList.map( (i,index) => {
                  return (
                    <Row className="position-relative mx-2" key={index}>
                      <span className="projectCounter">{index + 1}</span>
                      <div className="col-12 mt-2 mb-2">
                          <label>Username of {i.firstName} {i.lastName}</label>
                          <Input type="text" placeholder="" name="userName" value={i.userName}
                            onChange={(e) => this.handleInputChange(e, index)} maxLength="30" error={i.userNameError} required/>
                      </div>
                    </Row>
                  )
                })}
                
              </div> 
              :
              this.state.activeStep === 4 ?
              <div>
                {this.state.inputList.map( (i,index) => {
                  return (
                    <Row className="position-relative mx-2" key={index}>
                      <span className="projectCounter">{index + 1}</span>
                      <div className="col-12 mt-2 mb-2">
                          <label>Password of {i.firstName} {i.lastName}</label>
                          <Input type="text" placeholder="" name="password" value={i.password}
                            onChange={(e) => this.handleInputChange(e, index)} maxLength="30" error={i.passwordError} required/>
                      </div>
                    </Row>
                  )
                })}
              </div>
              :
              <div>

              </div>
            }
            </div>

            <Row className="justify-content-center mt-5 mb-3">
              {this.state.activeStep ===1 ? '' : <input type="button" className="nav_btn themeBtn-outline mr-2" value="Back" onClick={this.handleOnClickBack} /> }
              <input type="button" className="nav_btn" value={this.state.activeStep === steps.length ? 'Finish' : 'Next'} 
                onClick={this.state.activeStep > steps.length ? null : this.checkValidations} />            
            </Row> 
        </React.Fragment>
    )
  }

}

export default pageStepper;
