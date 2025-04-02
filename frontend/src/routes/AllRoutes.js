import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout, Logout } from '../components';
import { Home, Audit, EditAudit, Master, Viewer, Login, Approval, PdfGenerator, Users, Page404 } from '../pages';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../context/AuthContext';

// https://chatgpt.com/share/67922ff9-d764-8007-a12e-6053cac2f569

export const AllRoutes = () => {
    const { user } = useAuth();

    console.log('user :', user)
    // console.log('Role :', user.Role)

    if (!user) {
        // Redirect to login if the user is not logged in
        // return <Navigate to="/login" />;
    }

    return (
        <div>

            <Routes>
                <Route element={<MainLayout />}>
                    {/* Home and Viewer: Accessible to both admin and auditor */}
                    <Route path="/" element={<Home />} />
                    <Route path="/viewer" element={<Viewer />} />
                    <Route path="/pdfGenerator" element={<PdfGenerator />} />

                    {/* Approval and Master : Accessible only to admin */}
                    <Route path="/approval" element={
                        <PrivateRoute roles={['admin']}>
                            <Approval />
                        </PrivateRoute>
                    } />

                    <Route
                        path="/master"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <Master />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <Users />
                            </PrivateRoute>
                        }
                    />

                    {/* Audit, EditAudit : Accessible only to auditor */}

                    <Route
                        path="/audit"
                        element={
                            <PrivateRoute roles={['auditor']}>
                                <Audit />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/edit-audit"
                        element={
                            <PrivateRoute roles={['auditor']}>
                                <EditAudit />
                            </PrivateRoute>
                        }
                    />

                    {/* <Route path="/audit" element={<Audit />} />
                    <Route path="/edit-audit" element={<EditAudit />} />
                    <Route path="/master" element={<Master />} />
              
                    <Route path="/dashboard" element={<Dashboard />} /> */}



                    {/* Catch-All Route for 404 */}

                    <Route path='/unauthorized' element={<Page404 />} />
                </Route>

                {/* Login and Logout Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>

        </div>
    )
}
