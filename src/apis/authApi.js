import { baseUrl, authHeader, customTokenHeader, header } from './sharedApi';
import { requestHelper } from '../utils/helpers';

export const loginUser = async (credentials) => {
  const res = await requestHelper(`${baseUrl}/v1/token/`, 'POST', authHeader, credentials);

  return res;
};

export const signupUser = async (credentials) => {
  const res = await requestHelper(`${baseUrl}/v1/users/`, 'POST', authHeader, credentials);

  return res;
};

// Professional signup api

export const signupProfessional = async (credentials) => {
  const res = await requestHelper(`${baseUrl}/v1/professionals/`, 'POST', authHeader, credentials);

  return res;
};

export const resetPassword = async (body, token) => {
  const res = await requestHelper(
    `${baseUrl}/v1/users/reset/`,
    token ? 'PATCH' : 'POST',
    token ? await customTokenHeader(token) : authHeader,
    body
  );
  return res;
};

export const OTP = async (credentials) => {
  const res = await requestHelper(
    `${baseUrl}/v1/users/reset/verify/`,
    'POST',
    authHeader,
    credentials
  );
  return res;
};

export const changePassword = async (credentials) => {
  const res = await requestHelper(
    `${baseUrl}/password/change`,
    'POST',
    await header(),
    credentials
  );
  return res;
};

export const fetchSitToStandVideo = async () => {
  let url = `${baseUrl}/v1/sit-to-stand/video/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const fetchQuestionnaire = async () => {
  let url = `${baseUrl}/v1/questionnaire/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const postQuestionnaire = async (body) => {
  const res = await requestHelper(
    `${baseUrl}/v1/questionnaire/selections/`,
    'PATCH',
    await header(),
    body
  );
  return res;
};

export const getProfile = async () => {
  let url = `${baseUrl}/v1/users/client/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};
