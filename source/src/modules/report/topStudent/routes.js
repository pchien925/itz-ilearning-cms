import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import TopStudentListPage from '.';

const paths = {
    topStudentsListPage: '/top-student',
};

export default {
    topStudentListPage: {
        path: paths.topStudentsListPage,
        auth: true,
        component: TopStudentListPage,
        // permission: [apiConfig.rating.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.topStudent,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.topStudent) }];
            },
        },
    },
};