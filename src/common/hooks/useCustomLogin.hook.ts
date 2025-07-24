import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useFirebaseLogin } from './useFirebaseAuthHooks';

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    msg?: AxiosError;
}

export const useCustomLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login: firebaseLogin } = useFirebaseLogin();

    const login = async (endpoint: string, credentials: LoginCredentials): Promise<LoginResult> => {
        setIsLoading(true);

        try {
            console.log('🔐 Attempting Firebase login...');

            const result = await firebaseLogin(credentials.username, credentials.password);

            if (result.success && result.user) {
                console.log('✅ Firebase login successful:', result.user);

                localStorage.setItem(
                    'user_data',
                    JSON.stringify({
                        id: result.user.uid,
                        username: result.user.email,
                        type: 'staff',
                        roles: ['TEACHER'],
                        schoolId: 1,
                    }),
                );

                console.log('🔄 Firebase login complete, navigation will be handled automatically');
                return { success: true };
            } else {
                console.error('❌ Firebase login failed:', result.error);
                return { success: false };
            }
        } catch (error) {
            console.error('❌ Login failed:', error);
            setIsLoading(false);

            if (axios.isAxiosError(error)) {
                return { success: false, msg: error };
            }

            return { success: false };
        }
    };

    return { login, isLoading };
};
