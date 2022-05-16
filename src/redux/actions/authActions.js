import Cookies from 'js-cookie';
import * as types from '../types';
import { action } from '../../utils/helpers';
import { loginUser } from '../../apis/authApi';

export const setCurrentUser = (user) => action(types.SET_AUTH_USER_NAME, user);
export const setUserFirstName = (firstName) => action(types.SET_AUTH_USER_FIRSTNAME, firstName);
export const setUserLastName = (lastName) => action(types.SET_AUTH_USER_LASTNAME, lastName);

export const authToken = (token) => action(types.SET_AUTH_TOKEN, token);
export const setUserImage = (image) => action(types.SET_AUTH_IMAGE, image);
export const authEmail = (email) => action(types.SET_AUTH_EMAIL, email);
export const authData = (data) => action(types.SET_AUTH_DATA, data);

export const setModal = () => action(types.SET_AUTH_MODAL, {});
export const setThread = (data) => action(types.SET_THREAD, data);

export const login = (credentials, history) => {
  return async (dispatch) => {
    const response = await loginUser(credentials);
    if (!response.error) {
      //
      dispatch(setCurrentUser(response.data.user));
      await Cookies.set('notificationStatus', response.notificationPermission, { expires: 1 });
      await Cookies.set('userToken', response.token, { expires: 1 });
      await Cookies.set('deviceId', response.deviceId, { expires: 1 });
      history.push('/dashboard');
    } else {
      dispatch(setModal());
    }
  };
};
