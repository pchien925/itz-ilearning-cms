import { PageNotAllowed, PageNotFound } from '@itz/react-cms-element';
import groupPermissionRoutes from '@modules/groupPermission/routes';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
import mentorsRoutes from '@modules/mentor/routes';
import classroomRoutes from '@modules/classroom/routes';
import classroomStudentRoutes from '@modules/classroom/classroomStudent/routes';
import courseRoutes from '@modules/course/routes';
import syllabusRoutes from '@modules/course/syllabus/routes';
import ratingRoutes from '@modules/rating/routes';
import topStudentRoutes from '@modules/report/topStudent/routes';
import SettingsPageRoutes from '@modules/setting/routes';
import topCourseRoutes from '@modules/report/topCourse/routes';
import studentListRoutes from '@modules/student/routes';
import companyListRoutes from '@modules/company/routes';
import tagListRoutes from '@modules/tag/routes';
import sliderListRoutes from '@modules/category/slider/routes';
import deviceListRoutes from '@modules/category/device/routes';
import brandDeviceListRoutes from '@modules/category/device/brand/routes';

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
    ...mentorsRoutes,
    ...classroomRoutes,
    ...classroomStudentRoutes,
    ...courseRoutes,
    ...syllabusRoutes,
    ...ratingRoutes,
    ...topStudentRoutes,
    ...SettingsPageRoutes,
    ...topCourseRoutes,
    ...studentListRoutes,
    ...companyListRoutes,
    ...tagListRoutes,
    ...sliderListRoutes,
    ...deviceListRoutes,
    ...brandDeviceListRoutes,

    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
