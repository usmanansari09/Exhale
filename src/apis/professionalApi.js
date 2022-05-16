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
export const getClientsList = async () => {
  let url = `${baseUrl}/v1/professionals/clients/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const findClientsDetail = async (id) => {
  let url = `${baseUrl}/v1/professionals/clients/${id}/`;
  const res = await requestHelper(url, 'GET', await header());
  return res;
};

export const inviteCLient = async (data) => {
  let url = `${baseUrl}/v1/professionals/invite/`;
  const res = await requestHelper(url, 'POST', await header(), data);
  return res;
};
