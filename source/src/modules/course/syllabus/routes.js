import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import SyllabusDragDropPage from '.';



const paths = {
    coursesListPage: '/courses',
    syllabusDragDropPage: '/course/:id/syllabus',
};

export default {
    syllabusDragDropPage: {
        path: paths.syllabusDragDropPage,
        auth: true,
        component: SyllabusDragDropPage,
        permission: [apiConfig.syllabus.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.syllabus,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.course), path: paths.coursesListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};