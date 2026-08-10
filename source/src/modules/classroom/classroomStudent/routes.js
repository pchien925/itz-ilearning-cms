import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import ClassroomStudentListPage from '.';
// import ClassroomSavePage from './ClassroomSavePage';

const paths = {
    classroomStudentsListPage: '/classroom/:id/student',
    // classroomsSavePage: '/classrooms/:id',
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
                    { breadcrumbName: t.formatMessage(messages.classroom), path: '/classroom' },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    
};