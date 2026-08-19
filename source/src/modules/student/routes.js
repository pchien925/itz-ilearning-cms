import { KIND_ADMIN, KIND_CUSTOMER } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import StudentListPage from '.';
// import MentorSavePage from './MentorSavePage';
const paths = {
    studentsListPage: '/students',
    // mentorsSavePage: '/mentors/:id',
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
    // mentorSavePage: {
    //     path: paths.mentorsSavePage,
    //     component: MentorSavePage,
    //     separateCheck: true,
    //     auth: true,
    //     permission: [apiConfig.mentor.create.permissionCode, apiConfig.mentor.update.permissionCode],
    //     pageOptions: {
    //         objectName: commonMessage.mentor,
    //         kind: KIND_CUSTOMER,
    //         listPageUrl: paths.mentorsListPage,
    //         renderBreadcrumbs: (messages, t, title, options = {}) => {
    //             return [
    //                 { breadcrumbName: t.formatMessage(messages.mentor), path: paths.mentorsListPage },
    //                 { breadcrumbName: title },
    //             ];
    //         },
    //     },
    // },
};
