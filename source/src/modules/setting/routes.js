import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import SettingsPage from '.';

const paths = {
    settingsPage: '/settings', 
};

export default {
    settingsPage: {
        path: paths.settingsPage,
        auth: true,
        component: SettingsPage,
        permission: [
            apiConfig.setting.update.permissionCode, 
            apiConfig.setting.getList.permissionCode ,
        ],
        pageOptions: {
            objectName: commonMessage.setting, 
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.setting) },
                ];
            },
        },
    },
};