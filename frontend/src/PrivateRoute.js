import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, userRole, requiredRole, ...rest }) => {
    return (
        userRole === requiredRole ? <Component {...rest} /> : <Navigate to="/" />
    );
};

export default PrivateRoute;
