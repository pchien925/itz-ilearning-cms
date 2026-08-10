import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import ClassroomListPage from '.';
import ClassroomSavePage from './ClassroomSavePage';

const paths = {
    classroomsListPage: '/classrooms',
    classroomsSavePage: '/classrooms/:id',
};

export default {
    classroomListPage: {
        path: paths.classroomsListPage,
        auth: true,
        component: ClassroomListPage,
        permission: [apiConfig.classroom.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.classroom,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.classroom) }];
            },
        },
    },
    classroomSavePage: {
        path: paths.classroomsSavePage,
        component: ClassroomSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.classroom.create.permissionCode, apiConfig.classroom.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.classroom,
            listPageUrl: paths.classroomsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.classroom), path: paths.classroomsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};