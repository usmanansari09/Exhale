import { baseUrl, header } from './sharedApi';
import { requestHelper } from '../utils/helpers';

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

export const getQuestionsList = async () => {
  let url = `${baseUrl}/v1/questionnaire/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const sendAnswersList = async (data) => {
  let url = `${baseUrl}/v1/questionnaire/selections/`;
  const res = await requestHelper(url, 'PATCH', await header(), data);
  return res;
};

export const getUserProfile = async (data) => {
  let url = `${baseUrl}/v1/users/client/`;
  const res = await requestHelper(url, 'GET', await header(), data);
  return res;
};

export const editUserProfile = async (data) => {
  let url = `${baseUrl}/v1/users/client/`;
  const res = await requestHelper(url, 'PATCH', await header(), data);
  return res;
};

export const getAllExerciseslist = async () => {
  let url = `${baseUrl}/v1/users/series/all/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const submitCompleteExercise = async (id, data) => {
  let url = `${baseUrl}/v1/users/exercise/${id}/`;
  const res = await requestHelper(url, 'PATCH', await header(), data);
  return res;
};
export const submitCompleteLesson = async (id, data) => {
  let url = `${baseUrl}/v1/users/lesson/${id}/`;
  const res = await requestHelper(url, 'PATCH', await header(), data);
  return res;
};
