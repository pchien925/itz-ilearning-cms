import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import CourseListPage from '.';
import CourseSavePage from './CourseSavePage';

const paths = {
    coursesListPage: '/courses',
    coursesSavePage: '/courses/:id',
};

export default {
    courseListPage: {
        path: paths.coursesListPage,
        auth: true,
        component: CourseListPage,
        permission: [apiConfig.course.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.courseInfo,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.course) }];
            },
        },
    },
    courseSavePage: {
        path: paths.coursesSavePage,
        component: CourseSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.course.create.permissionCode, apiConfig.course.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.course,
            listPageUrl: paths.coursesListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.course), path: paths.coursesListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};