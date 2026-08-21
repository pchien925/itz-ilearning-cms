import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import RegistrationListPage from '.';

const paths = {
    registrationsListPage: '/registration',
};

export default {
    registrationListPage: {
        path: paths.registrationsListPage,
        auth: true,
        component: RegistrationListPage,
        permission: [apiConfig.registration.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.registration,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.registration) }];
            },
        },
    },
};