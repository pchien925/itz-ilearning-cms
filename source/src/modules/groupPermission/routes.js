import apiConfig from '@constants/apiConfig';
import GroupPermissionListPage from '.';
import PermissionSavePage from './PermissionSavePage';
import { commonMessage } from '@locales/intl';
const paths = {
    groupPermissionListPage: '/group-permission',
    groupPermissionSavePage: '/group-permission/:id',
};
export default {
    groupPermissionListPage: {
        path: paths.groupPermissionListPage,
        component: GroupPermissionListPage,
        auth: true,
        permission: [apiConfig.groupPermission.getGroupList.permissionCode],
        pageOptions: {
            objectName: commonMessage.groupPermission,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.groupPermission) }];
            },
        },
    },
    groupPermissionSavePage: {
        path: paths.groupPermissionSavePage,
        component: PermissionSavePage,
        auth: true,
        permission: [apiConfig.groupPermission.getById.permissionCode, apiConfig.groupPermission.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.groupPermission,
            listPageUrl: paths.groupPermissionListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.groupPermission), path: paths.groupPermissionListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
