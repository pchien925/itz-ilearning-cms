import { KIND_ADMIN } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import UserAdminListPage from '.';
import UserAdminSavePage from './UserAdminSavePage';
const paths = {
    adminsListPage: '/admins',
    adminsSavePage: '/admins/:id',
};
export default {
    adminListPage: {
        path: paths.adminsListPage,
        auth: true,
        component: UserAdminListPage,
        permission: [apiConfig.account.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.user,
            kind: KIND_ADMIN,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.user) }];
            },
        },
    },
    adminSavePage: {
        path: paths.adminsSavePage,
        component: UserAdminSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.account.createAdmin.permissionCode, apiConfig.account.updateAdmin.permissionCode],
        pageOptions: {
            objectName: commonMessage.user,
            kind: KIND_ADMIN,
            listPageUrl: paths.adminsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.user), path: paths.adminsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
