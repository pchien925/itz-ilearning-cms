import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import TopCourseListPage from '.';

const paths = {
    topCoursesListPage: '/top-course',
};

export default {
    topCourseListPage: {
        path: paths.topCoursesListPage,
        auth: true,
        component: TopCourseListPage,
        permission: [apiConfig.report.getTopCourse.permissionCode],
        pageOptions: {
            objectName: commonMessage.reportTopCourse,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.reportTopCourse) }];
            },
        },
    },
};