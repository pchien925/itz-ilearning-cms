import { KIND_ADMIN, KIND_CUSTOMER, KIND_EMPLOYEE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import CompanyListPage from '.';
import CompanySavePage from './CompanySavePage';
const paths = {
    companysListPage: '/companys',
    companysSavePage: '/companys/:id',
};
export default {
    companyListPage: {
        path: paths.companysListPage,
        auth: true,
        component: CompanyListPage,
        permission: [apiConfig.company.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.company,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.company) }];
            },
        },
    },
    companySavePage: {
        path: paths.companysSavePage,
        component: CompanySavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.company.create.permissionCode, apiConfig.company.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.company,
            listPageUrl: paths.companysListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.company), path: paths.companysListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
