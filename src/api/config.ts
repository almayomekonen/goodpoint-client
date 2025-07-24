import axios from 'axios';
import { getAuth } from 'firebase/auth';

const getBaseURL = () => {
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:3000';
    }

    return (
        import.meta.env.VITE_SERVER_URL ||
        'https://goodpoint-server-production.up.railway.app' ||
        'http://localhost:3000'
    );
};

const baseURL = getBaseURL();
axios.defaults.baseURL = baseURL;

export const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        if (config.url?.includes('/login') || config.url?.includes('/public')) {
            return config;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log(error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 400 && error.response?.data?.message?.includes?.('school association')) {
            if (error.response.data) {
                error.response.data.userFriendlyMessage =
                    'Your account is not associated with a school. Please contact your administrator to resolve this issue.';
                error.response.data.technicalDetails =
                    'Missing user-school association in database. Use debug endpoints to diagnose and fix.';
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
