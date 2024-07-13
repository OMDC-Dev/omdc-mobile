import axios from 'axios';
import {BASE_URL} from './apiRoutes';
import {API_STATES} from '../utils/constant';
import {retrieveData} from '../utils/store';

export const fetchApi = async props => {
  const {url, method, data, headers} = props;

  const user = await retrieveData('USER_SESSION', true);

  let customHeaders = {
    ...headers,
    'Content-Type': 'application/json',
  };

  if (user) {
    customHeaders.Authorization = `Bearer ${user?.userToken}`;
  }

  try {
    console.log('\x1b[32m%s\x1b[0m', 'Hit API -> ', BASE_URL + url);
    return axios({
      baseURL: BASE_URL,
      url: url,
      method: method || 'GET',
      data: data,
      headers: customHeaders,
      timeout: 120000,
    })
      .then(resData => {
        return {state: API_STATES.OK, data: resData?.data?.data, error: []};
      })
      .catch(error => {
        console.log(error);
        return {
          state: API_STATES.ERROR,
          data: [],
          error: error?.response?.data?.error,
        };
      });
  } catch (error) {
    console.log(error);
    return {
      state: API_STATES.ERROR,
      data: [],
      error: error?.response?.data?.error,
    };
  }
};
