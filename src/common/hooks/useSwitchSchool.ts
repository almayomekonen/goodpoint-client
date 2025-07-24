import { useSetAuthItem } from './useFirebaseAuthHooks';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/config';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_NAME } from '../consts/auth-storage.consts';

export const useSwitchSchool = () => {
    const queryClient = useQueryClient();
    const setAuthItem = useSetAuthItem();
    async function switchSchool(schoolId: number) {
        await apiClient.post('/api/staff/login-to-different-school', { schoolId });

        const token = Cookies.get(ACCESS_TOKEN_NAME);
        if (token) setAuthItem(ACCESS_TOKEN_NAME, token);
        const kloItem = Cookies.get('klo');
        if (kloItem) setAuthItem('klo', kloItem);
        queryClient.invalidateQueries({ type: 'all' });
    }

    return switchSchool;
};
