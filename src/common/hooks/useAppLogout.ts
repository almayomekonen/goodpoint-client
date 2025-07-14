import { useLogout } from '@hilma/auth';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for logging out the user.
 * @returns {Function} logout function
 */
export const useAppLogout = () => {
    const queryClient = useQueryClient();
    const _logout = useLogout();
    const navigate = useNavigate();

    async function logout() {
        // logout in the server needs to be before _logout
        await axios.post('/api/staff/logout');
        await _logout();
        queryClient.clear();
        navigate('/', { replace: true });
    }

    return logout;
};
