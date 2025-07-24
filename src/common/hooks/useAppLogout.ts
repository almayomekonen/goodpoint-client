import { useLogout } from './useFirebaseAuthHooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/config';

export const useAppLogout = () => {
    const queryClient = useQueryClient();
    const _logout = useLogout();
    const navigate = useNavigate();

    async function logout() {
        await apiClient.post('/api/staff/logout');
        await _logout();
        queryClient.clear();
        navigate('/', { replace: true });
    }

    return logout;
};
