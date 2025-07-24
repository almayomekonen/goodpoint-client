import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

interface FirebasePrivateRouteProps {
    component: React.ReactElement;
    componentName?: string;
    redirectPath?: string;
}

export const FirebasePrivateRoute: React.FC<FirebasePrivateRouteProps> = ({ component, redirectPath = '/' }) => {
    const { isAuthenticated, isLoading } = useFirebaseAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return component;
};
