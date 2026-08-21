import apiConfig from '@constants/apiConfig';
import { CATEGORY_KIND_SLIDER } from '@constants';
import { commonMessage } from '@locales/intl';
import CategoryListPage from '.';
import CategorySavePage from './SliderSavePage';
const paths = {
    categorysListPage: '/sliders',
    categorysSavePage: '/sliders/:id',
};
export default {
    categoryListPage: {
        path: paths.categorysListPage,
        auth: true,
        component: CategoryListPage,
        permission: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_SLIDER,
            objectName: commonMessage.slider,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.slider) }];
            },
        },
    },
    categorySavePage: {
        path: paths.categorysSavePage,
        component: CategorySavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            kind: CATEGORY_KIND_SLIDER,
            objectName: commonMessage.slider,
            listPageUrl: paths.categorysListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.slider), path: paths.categorysListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
