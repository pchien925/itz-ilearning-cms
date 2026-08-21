import apiConfig from '@constants/apiConfig';
import { CATEGORY_KIND_DEVICE } from '@constants';
import { commonMessage } from '@locales/intl';
import DeviceListPage from '.';
import DeviceSavePage from './DeviceSavePage';

const paths = {
    devicesListPage: '/devices',
    devicesSavePage: '/devices/:id',
};

export default {
    deviceListPage: {
        path: paths.devicesListPage,
        auth: true,
        component: DeviceListPage,
        permission: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_DEVICE,
            objectName: commonMessage.device,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.device) }];
            },
        },
    },
    deviceSavePage: {
        path: paths.devicesSavePage,
        component: DeviceSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_DEVICE,
            objectName: commonMessage.device,
            listPageUrl: paths.devicesListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.device), path: paths.devicesListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};