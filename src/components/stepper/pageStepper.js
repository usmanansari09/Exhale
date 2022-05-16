import React, { Component } from 'react';
import Stepper from 'react-js-stepper';
import CheckboxExample from '../../components/checkboxes';
import RadioButtonExample from '../../components/radiobuttons';

import { SignupText, SignupButton } from '../../container/screens/LandingScreen/style';
import './style.css';

let steps = [{}, {}, {}, {}, {}, {}];

class PageStepper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 1,
      choices: [],
      answersList: [],
    };
  }

  componentDidMount = () => {
    document.getElementById('root').scrollIntoView();
    steps = this.props.data;
  };

  // handle participate input change
  stepperReturn = (answersList) => {
    this.setState({ answersList });
  };

  checkValidations = async () => {
    let { choices, answersList } = this.state;

    if (choices.length === 0) choices = answersList;
    else {
      this.props.data.forEach((element) => {
        if (this.state.activeStep === element.id) {
          element.choices.forEach((element) => {
            choices.forEach(function (item, index, object) {
              if (item.id === element.id) {
                object.splice(index, 1);
              }
            });
          });
        }
      });

      answersList.forEach((element2) => {
        choices.push(element2);
      });
    }
    this.setState({ choices });

    if (this.state.activeStep === steps.length) {
      this.props.getAnswers(this.state.choices);
    } else this.handleOnClickNext();
  };

  handleOnClickStepper = (step) => {
    this.setState({ activeStep: step });
  };

  handleOnClickNext = () => {
    // choices = choices.filter( (ele, ind) => ind === choices.findIndex( elem => elem.id === ele.id))
    let nextStep = this.state.activeStep + 1;
    this.setState({ activeStep: nextStep, answersList: [] });
  };

  handleOnClickBack = () => {
    let prevStep = this.state.activeStep - 1;
    this.setState({ activeStep: prevStep });
  };

  render() {
    return (
      <React.Fragment>
        <Stepper
          steps={this.props.data}
          activeStep={this.state.activeStep}
          onSelect={this.checkValidations}
          showNumber={true}
        />

        <div className="d-flex justify-content-center mt-5">
          {this.props.data &&
            this.props.data.map((data, index) => {
              return (
                <form
                  key={index}
                  className={`${this.state.activeStep === data.position ? '' : 'd-none'}`}
                  style={{ width: '500px' }}
                >
                  <SignupText className="mb-4" isOk={true}>
                    {data.question_text}
                  </SignupText>

                  {data.allow_many ? (
                    <CheckboxExample
                      selectedData={(data) => {
                        this.stepperReturn(data);
                      }}
                      list={data.choices}
                    ></CheckboxExample>
                  ) : (
                    <RadioButtonExample
                      selectedData={(data) => {
                        this.stepperReturn(data);
                      }}
                      list={data.choices}
                      name={data.question_text}
                    ></RadioButtonExample>
                  )}

                  {this.state.answersList.length > 0 ? (
                    <SignupButton
                      type="button"
                      className={'w-100 mt-4'}
                      onClick={this.state.activeStep > steps.length ? null : this.checkValidations}
                    >
                      {this.state.activeStep === steps.length ? 'Finish' : 'Next'}
                    </SignupButton>
                  ) : (
                    <SignupButton type="button" style={{ opacity: 0.5 }} className={'w-100 mt-4'}>
                      {' '}
                      {this.state.activeStep === steps.length ? 'Finish' : 'Next'}
                    </SignupButton>
                  )}

                  {this.state.activeStep === 1 ? (
                    <SignupButton
                      outline={true}
                      type="button"
                      className={'w-100 mt-4'}
                      onClick={this.props.back}
                    >
                      Back
                    </SignupButton>
                  ) : (
                    <SignupButton
                      outline={true}
                      type="button"
                      className={'w-100 mt-4'}
                      onClick={this.handleOnClickBack}
                    >
                      Back
                    </SignupButton>
                  )}
                </form>
              );
            })}
        </div>
      </React.Fragment>
    );
  }
}

export default PageStepper;
