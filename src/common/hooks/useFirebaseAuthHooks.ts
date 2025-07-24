import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

// Replace useIsAuthenticated from @hilma/auth
export const useIsAuthenticated = () => {
    const { isAuthenticated } = useFirebaseAuth();
    return isAuthenticated;
};

// Replace useGetAccessToken from @hilma/auth
export const useGetAccessToken = () => {
    const { user } = useFirebaseAuth();

    return () => {
        if (user) {
            return user.getIdToken();
        }
        return null;
    };
};

// Replace useLogout from @hilma/auth
export const useLogout = () => {
    const { logout } = useFirebaseAuth();
    return logout;
};

// Replace useSetAuthItem from @hilma/auth (simplified for Firebase)
export const useSetAuthItem = () => {
    return (key: string, value: any) => {
        // For Firebase, we don't need to manually set auth items
        // Firebase handles this automatically
        console.log('Firebase auth item set:', key, value);
    };
};

// Firebase login hook
export const useFirebaseLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error: any) {
            console.error('Firebase login error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading };
};
