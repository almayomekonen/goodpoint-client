import React from 'react';
import { useGetAccessToken } from '../../../common/hooks/useFirebaseAuthHooks';
import { parseJwt } from '../../../common/functions/decodeToken';

export function useIsAdmin(type: 'SUPERADMIN' | 'ADMIN' = 'SUPERADMIN') {
    const getToken = useGetAccessToken();
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const checkAdmin = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    setIsAdmin(false);
                    setIsLoading(false);
                    return;
                }

                const user = parseJwt(token);

                if (!user || !user.roles || !Array.isArray(user.roles)) {
                    setIsAdmin(false);
                    setIsLoading(false);
                    return;
                }

                setIsAdmin(user.roles.includes(type));
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [getToken, type]);

    if (isLoading) return false;
    return isAdmin;
}
