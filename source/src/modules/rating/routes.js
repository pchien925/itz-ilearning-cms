import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import RatingListPage from '.';

const paths = {
    ratingsListPage: '/rating',
};

export default {
    ratingListPage: {
        path: paths.ratingsListPage,
        auth: true,
        component: RatingListPage,
        permission: [apiConfig.rating.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.rating,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.rating) }];
            },
        },
    },
};