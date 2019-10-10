import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://10.76.0.163:5001',
  timeout: 3000,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.response.use(resp => {
  if (resp.status >= 200 & resp.status < 300 || resp.status === 304) {
    return resp;
  }
  throw new Error('请求错误，可能是网络问题');
}, error => {
  throw new Error(error.message);
});

export function post(setting) {
  const {
    url,
    data,
    config,
  } = setting;

  return axiosInstance.post(
    url,
    {
      ...data,
    },
    config,
  );
}

export function get(setting) {
  const {
    url,
    config,
  } = setting;

  return axiosInstance.get(
    url,
    config,
  );
}