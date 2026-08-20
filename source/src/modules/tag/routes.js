import { KIND_ADMIN, KIND_CUSTOMER, KIND_EMPLOYEE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import TagListPage from '.';
const paths = {
    tagsListPage: '/tags',
};
export default {
    tagListPage: {
        path: paths.tagsListPage,
        auth: true,
        component: TagListPage,
        permission: [apiConfig.tag.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.tag,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.tag) }];
            },
        },
    },
};
