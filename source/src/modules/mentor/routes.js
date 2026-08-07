import { KIND_ADMIN, KIND_CUSTOMER } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import MentorListPage from '.';
import MentorSavePage from './MentorSavePage';
const paths = {
    mentorsListPage: '/mentors',
    mentorsSavePage: '/mentors/:id',
};
export default {
    mentorListPage: {
        path: paths.mentorsListPage,
        auth: true,
        component: MentorListPage,
        permission: [apiConfig.mentor.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.mentor,
            kind: KIND_CUSTOMER,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.mentor) }];
            },
        },
    },
    mentorSavePage: {
        path: paths.mentorsSavePage,
        component: MentorSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.mentor.create.permissionCode, apiConfig.mentor.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.user,
            kind: KIND_CUSTOMER,
            listPageUrl: paths.mentorsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.user), path: paths.mentorsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
