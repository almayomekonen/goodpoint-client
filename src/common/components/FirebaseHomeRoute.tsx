import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

interface FirebaseHomeRouteProps {
    redirectComponent: React.ReactElement;
    components: Record<string, React.ComponentType<any>>;
}

export const FirebaseHomeRoute: React.FC<FirebaseHomeRouteProps> = ({ redirectComponent, components }) => {
    const { isAuthenticated, isLoading } = useFirebaseAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return redirectComponent;
    }

    return (
        <Routes>
            {Object.entries(components).map(([name, Component]) => (
                <Route key={name} path={`/${name.toLowerCase()}/*`} element={<Component />} />
            ))}
            <Route
                path="/"
                element={components.MyClasses ? <components.MyClasses /> : <Navigate to="/myclasses" replace />}
            />
            <Route
                index
                element={components.MyClasses ? <components.MyClasses /> : <Navigate to="/myclasses" replace />}
            />
        </Routes>
    );
};
