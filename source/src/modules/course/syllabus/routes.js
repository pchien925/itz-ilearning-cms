import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import ClassroomStudentListPage from '.';

const paths = {
    classroomsListPage: '/classrooms',
    classroomStudentsListPage: '/classroom/:id/student',
};

export default {
    ClassroomStudentListPage: {
        path: paths.classroomStudentsListPage,
        auth: true,
        component: ClassroomStudentListPage,
        permission: [apiConfig.classroomStudent.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.student,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.classroom), path: paths.classroomsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    
};