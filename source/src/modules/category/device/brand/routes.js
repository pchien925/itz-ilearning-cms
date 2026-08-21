import apiConfig from '@constants/apiConfig';
import { CATEGORY_KIND_DEVICEBRAND } from '@constants';
import { commonMessage } from '@locales/intl';
import BrandDeviceListPage from '.';
import BrandDeviceSavePage from './BrandDeviceSavePage';

const paths = {
    devicesListPage: '/devices',
    brandDevicesListPage: '/device/:parentId/brand',
    brandDevicesSavePage: '/device/:parentId/brand/:id',
};

export default {
    brandDeviceListPage: {
        path: paths.brandDevicesListPage,
        auth: true,
        component: BrandDeviceListPage,
        permission: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_DEVICEBRAND,
            objectName: commonMessage.brand,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.brand), path: paths.devicesListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    brandDeviceSavePage: {
        path: paths.brandDevicesSavePage,
        component: BrandDeviceSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_DEVICEBRAND,
            objectName: commonMessage.device,
            listPageUrl: paths.brandDevicesListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.brand), path: paths.brandDevicesListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};