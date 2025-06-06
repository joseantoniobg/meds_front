import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_BASEURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;