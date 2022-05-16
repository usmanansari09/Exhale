import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { passwordValidator, confirmPasswordValidator} from '../../../shared/validators/Validators';
import { loading} from '../../../redux/actions/loaderActions'
import { succesSwal, errorSwal } from '../../../components/swal/Swal';
import { resetPassword } from'../../../apis/authApi';

import styles from '../sign-in/login-style.module.css'

class Reset_Password extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        password:'',
        confirmPassword:'',
        show_hide:false,
        show_hide2:false
      }
    }
    
    componentDidMount =()=>{
        document.getElementById('root').scrollIntoView();
        this.setState({
            id:     this.props.match.params.id,
            token:  this.props.match.params.token 
        })      
    }

    handleChange=(event)=> {
        this.setState({[event.target.name]: event.target.value});
    }

    click = async(e)=>{
        e.preventDefault();

        let passwordvalidator = await passwordValidator(this.state.password);
        let confirmPassValidator = await confirmPasswordValidator(this.state.password,this.state.confirmPassword);
        
        if(passwordvalidator){
            this.setState({passwordError: passwordvalidator})
        }
        if(confirmPassValidator){
            this.setState({confirmPasswordError: confirmPassValidator})
        }
        else
        {
            this.props.loading(true);
            let response = await resetPassword({id:this.state.id,token:this.state.token, password:this.state.password});
            if(response.code === 400){
                errorSwal('oops',response.message);
                this.props.loading(false);
            }
            else
            {
                this.props.loading(false);

                succesSwal( response.message);                    
                this.props.history.push('/login');
            }
        }                
    }

    changeShowHide = ()=>{
        const hideShow = this.state.show_hide;
        if(hideShow)
        {
            this.setState({show_hide: false})
        }
        else
        {
            this.setState({show_hide: true})
        }       
    }

    changeShowHide2 = ()=>{
        const hideShow = this.state.show_hide2;
        if(hideShow)
        {
            this.setState({show_hide2: false})
        }
        else
        {
            this.setState({show_hide2: true})
        }       
    }

    render() {
        return (
            <div className="position-relative">
                <div className="half-circle right-circle"></div>
                <div className="half-circle left-circle"></div>
               
                <div className={`container ${styles.page_main}`}>
                <h2 className="page-title">Reset Password</h2>
              
                    <form className="mt-5" onSubmit={this.click}>
                        <label>New Password</label>
                        <span className="position-relative">
                            <input type={this.state.show_hide ? "text" : "password"} placeholder="Enter New Password" name="password" value={this.state.password}
                            onChange={this.handleChange} maxLength="30"
                            required />
                            <i className={this.state.show_hide ? "hide-show fa fa-eye" : "hide-show fa fa-eye-slash" } onClick={this.changeShowHide}></i>
                        </span>  
                        {this.state.passwordError && <span className='error'>{this.state.passwordError}</span>}
                       
                        <div className="mt-3 mb-3">
                            <label>Confirm Password</label>
                            <span className="position-relative">
                                <input type={this.state.show_hide2 ? "text" : "password"} placeholder="Enter Confirm Password" 
                                name="confirmPassword" value={this.state.confirmPassword}
                                onChange={this.handleChange} maxLength="30"
                                required />
                                <i className={this.state.show_hide2 ? "hide-show fa fa-eye" : "hide-show fa fa-eye-slash" } onClick={this.changeShowHide2}></i>
                            </span>  
                            {this.state.confirmPasswordError && <span className='error'>{this.state.confirmPasswordError}</span>}
                        </div>    
                        
                                    
                        <button type="submit" className="button-default themeBtn">Submit</button>
                    </form>                                
                    <div  className={styles.login_text}>
                        Already have an account?
                        <Link from="/forgot-password" to="/login">
                            Login
                        </Link>
                    </div>
                </div>

            </div>       
        )
    }
}
const mapStateToProps = state => {
    return {
        loading: state.loader.loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loading: loadingStatus => {dispatch(loading(loadingStatus))}
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reset_Password));