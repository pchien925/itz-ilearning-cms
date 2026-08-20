import { KIND_ADMIN, KIND_CUSTOMER, KIND_EMPLOYEE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import StudentListPage from '.';
import StudentSavePage from './StudentSavePage';
const paths = {
    studentsListPage: '/students',
    studentsSavePage: '/students/:id',
};
export default {
    studentListPage: {
        path: paths.studentsListPage,
        auth: true,
        component: StudentListPage,
        permission: [apiConfig.student.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.student,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.student) }];
            },
        },
    },
    studentSavePage: {
        path: paths.studentsSavePage,
        component: StudentSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.student.create.permissionCode, apiConfig.student.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.student,
            kind: KIND_EMPLOYEE,
            listPageUrl: paths.studentsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.student), path: paths.studentsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
