import { PageNotAllowed, PageNotFound } from '@itz/react-cms-element';
import groupPermissionRoutes from '@modules/groupPermission/routes';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    // homePage: {
    //     path: '/',
    //     component: Dashboard,
    //     auth: false,
    //     title: 'Home',
    // },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    ...adminsRoutes,
    ...groupPermissionRoutes,
    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
