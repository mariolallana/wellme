const DEV_API_URL = 'http://192.168.1.141:3000/api';
const PROD_API_URL = 'http://192.168.1.141:3000/api'; // Change this for production

export const API_CONFIG = {
    BASE_URL: __DEV__ ? DEV_API_URL : PROD_API_URL
};