import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();
    console.log('user  :', user)
    console.log('roles  :', roles)
    if (!user) return <Navigate to="/login" />; // Redirect if not logged in
    if (roles && !roles.includes(user.Role)) return <Navigate to="/unauthorized" />;

    return children; // if ok back to calling page
}
