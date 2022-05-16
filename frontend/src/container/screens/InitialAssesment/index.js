import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loading } from "../../../redux/actions/loaderActions";
import Header from "../../../container/Layout/Header";

import { fetchQuestionnaire } from "../../../apis/authApi";

import { Wellcome, Question, Submit } from "./screens";

class InitialScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assesmentOption: 0,
      optionValues: {},
      questionnaireList: [],
    };
  }

  componentDidMount = () => {
    this.getQuestionnaire();
  };
  nextOption = (option) => {
    this.setState({ assesmentOption: option });
  };

  setOptionValues = (name, value) => {
    const obj = this.state.optionValues;
    obj[name] = value;
    this.setState({
      optionValues: obj,
    });

    console.log(obj);
  };

  getQuestionnaire = async () => {
    this.props.loading(true);
    let response = await fetchQuestionnaire();
    if (response.status === 400) {
      response = await response.json();
      // errorSwal('oops',response.non_field_errors[0]);
      this.props.loading(false);
    } else if (response.status === 200) {
      response = await response.json();
      this.props.loading(false);
      this.setState({ questionnaireList: response });
    }
  };

  render() {
    const { assesmentOption, optionValues, questionnaireList } = this.state;
    return (
      <>
        <Header buttonText="signup" />
        {assesmentOption === 0 && (
          <Wellcome
            nextOption={this.nextOption}
            setOptionValues={this.setOptionValues}
          />
        )}

        {questionnaireList.map((item) => {
          return (
            assesmentOption === item.id && (
              <Question
                nextOption={this.nextOption}
                setOptionValues={this.setOptionValues}
                item={item}
              />
            )
          );
        })}

        {assesmentOption === questionnaireList.length + 1 && (
          <Submit optionValues={optionValues} />
        )}
      </>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InitialScreen)
);
