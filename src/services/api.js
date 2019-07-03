import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.gitHub.com',
});

export default api;
