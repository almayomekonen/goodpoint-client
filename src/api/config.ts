import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:8080';
    }

    return (
        import.meta.env.VITE_SERVER_URL ||
        'https://goodpoint-server-production.up.railway.app' ||
        'http://localhost:8080'
    );
};

const baseURL = getBaseURL();
axios.defaults.baseURL = baseURL;

console.log('🔧 Axios Config:');
console.log('   Base URL:', baseURL);
console.log('   Mode:', import.meta.env.MODE);

export const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log('📡 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    },
);

export default apiClient;
