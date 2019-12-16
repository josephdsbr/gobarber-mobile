import axios from 'axios';

const api = axios.create({
  baseURL: 'http://157.245.212.211:3334',
});

export default api;