import { useGetAccessToken } from '@hilma/auth';
import { parseJwt } from '../../../common/functions/decodeToken';

export function useIsAdmin(type: 'SUPERADMIN' | 'ADMIN' = 'SUPERADMIN') {
    const getToken = useGetAccessToken();
    const token = getToken();
    if (!token) throw Error('problem with user cookies'); //meaning problem with cookies of current user
    //the current logged in user
    const user = parseJwt(token);
    if (user.roles.includes(type)) {
        return true;
    }
    return false;
}
