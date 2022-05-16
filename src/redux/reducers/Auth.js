import * as types from '../types';
const initialState = {
  email: '',
  loginData: localStorage.getItem('roleId'),
  userName: localStorage.getItem('currentUserName'),
  userLastName: localStorage.getItem('lastName'),
  userFirstName: localStorage.getItem('firstName'),
  userToken: localStorage.getItem('token'),
  userImage: localStorage.getItem('userImage'),
  modalShow: '',
  thread: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_AUTH_USER_NAME:
      return {
        ...state,
        userName: action.payLoad,
      };
    case types.SET_AUTH_USER_FIRSTNAME:
      return {
        ...state,
        userFirstName: action.payLoad,
      };
    case types.SET_AUTH_USER_LASTNAME:
      return {
        ...state,
        userLastName: action.payLoad,
      };
    case types.SET_AUTH_TOKEN:
      return {
        ...state,
        userToken: action.payLoad,
      };
    case types.SET_AUTH_IMAGE:
      return {
        ...state,
        userImage: action.payLoad,
      };
    case types.SET_AUTH_EMAIL:
      return {
        ...state,
        email: action.payLoad,
      };
    case types.SET_AUTH_DATA:
      return {
        ...state,
        loginData: action.payLoad,
      };
    case types.SET_THREAD:
      return {
        ...state,
        thread: action.payLoad,
      };

    // return {
    //   ...state,
    //   modalShow: !state.modalShow
    // }
    default:
      return state;
  }
};
