import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { ProtectedRoute } from "./authGuard/protected.route";

import Loader from './components/loader';
import Login from './container/Auth/sign-in';
import Signup from './container/Auth/sign-up';

import {LandingScreen, InitialScreen} from './container/screens';
import Dashboard from './container/screens/Dashboard/dashboard';

import NotFound from './components/not-found';
   
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      auth: !!this.props.logindata,
      page: false,
      logindata: this.props.logindata,
      clientCookie: false,
      logout: false,
      connection: '',
    }
  }
  componentDidMount() {

  }

  render() {
    let routes = "";
  
    if (!this.props.logindata || this.props.logindata.length === 0) {
      routes = (
        <div>
            <Switch>   
              <Route exact path="/login" component={Login} /> 
              <Route exact path="/signup" component={Signup} />  
              <Route exact path="/Landing" component={LandingScreen} />

              <ProtectedRoute exact path="/initial-assesment" component={InitialScreen} />
              <ProtectedRoute exact path="/dashboard" component={Dashboard} />


              <Redirect exact from="/" to="/Landing" />
              <Route component={NotFound} />
            </Switch>
          {/* <Footer /> */}
        </div> 
      );
    }
    
    return (
      <div className='main'>
        <Loader loading={this.props.loading} />
        {routes}
      </div >

    )
  }
}


const mapStateToProps = state => {
  return {
    logindata: state.auth.logindata,
    loading: state.loader.show,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));