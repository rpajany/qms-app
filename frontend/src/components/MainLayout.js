import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';

export const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
