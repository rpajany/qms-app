const menus = {
    admin: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Manage Users', path: '/users' },
        { name: 'Settings', path: '/settings' },
    ],
    user: [
        { name: 'Home', path: '/' },
        { name: 'Profile', path: '/profile' },
    ],
    guest: [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
    ],
};

export default menus;