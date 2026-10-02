const productionApiUrl = 'https://library-management-by-arjun.onrender.com/api';
const developmentApiUrl = 'http://localhost:5000/api';

export const API = (process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' ? productionApiUrl : developmentApiUrl
)).replace(/\/$/, '');