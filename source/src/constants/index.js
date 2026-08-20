export const apiUrl = process.env.REACT_APP_API;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';
export const urlVariable = '{URL}';

export const ADMIN_LOGIN_TYPE = 'password';
export const X_CLIENT_TYPE = 'WEB';

export const appAccount = {
    APP_USERNAME: process.env.REACT_APP_USERNAME,
    APP_PASSWORD: process.env.REACT_APP_PASSWORD,
};

export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

export const brandName = 'iTZ CMS System';

export const appName = 'iTZ-cms';

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
    USER_KIND: `${appName}-user-kind`,
};


export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    avatarRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    langKey: 'vi',
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'vi';
export const locales = ['en', 'vi'];

export const activityType = {
    GAME: 'game',
    VIDEO: 'video',
    ARTICLE: 'article',
    FOCUS_AREA: 'focus-area',
};

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DATE_FORMAT_BASIC = 'dd.MM.yyyy';
export const DATE_FORMAT_BASIC_FIX = 'DD.MM.YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DEFAULT_FORMAT_ZERO_SECOND = 'DD/MM/YYYY HH:mm:00';
export const DEFAULT_FORMAT_ZERO = 'DD/MM/YYYY 00:00:00';
export const DEFAULT_FORMAT_BASIC = 'dd.MM.yyyy HH:mm:ss';
export const DEFAULT_FORMAT_BASIC_FIX = 'DD.MM.YYYY HH:mm:ss';

export const DATE_FORMAT_ZERO_TIME = 'DD/MM/YYYY 00:00:00';
export const DATE_FORMAT_END_OF_DAY_TIME = 'DD/MM/YYYY 23:59:59';

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;

export const SORT_DATE = 3;

export const KIND_ADMIN = 1;
export const KIND_CUSTOMER = 2;
export const KIND_EMPLOYEE = 3;

export const ROLE_KIND_ADMIN = 1;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;

export const DEFAULT_TABLE_ISPAGED = 1;
export const DEFAULT_TABLE_ISPAGED_0 = 0;
export const DEFAULT_TABLE_ITEM_SIZE = 20;
export const DEFAULT_TABLE_ITEM_SIZE_10 = 10;
export const DEFAULT_TABLE_PAGE_START = 0;
export const DEFAULT_TABLE_ITEM_SIZE_ALL = 1000;

export const FILTER_PREFIX = `filter:`;

export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    INACTIVE: -1,
    DELETE: -2,
};

export const UserTypes = {
    ADMIN: 1,
    CUSTOMER: 2,
    EMPLOYEE: 3,
};

export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.INACTIVE]: 'red',
    [commonStatus.DELETE]: 'red',
};

export const classroomState = {
    PENDING: 0,
    ACTIVE: 1,
    DONE: 2,
    CANCEL: 3,
};

export const classroomStateColor = {
    [classroomState.PENDING]: 'warning',
    [classroomState.ACTIVE]: 'green',
    [classroomState.DONE]: 'blue',
    [classroomState.CANCEL]: 'red',
};

export const classroomStudentState = {
    PENDING: 0,
    APPROVE: 1,
    REJECT: 2,
};

export const classroomStudentStateColor = {
    [classroomStudentState.PENDING]: 'warning',
    [classroomStudentState.APPROVE]: 'green',
    [classroomStudentState.REJECT]: 'red',
};

export const GROUP_KIND_ADMIN = 1;
export const GROUP_KIND_MANAGER = 2;
export const GROUP_KIND_USER = 3;

export const groupPermissionKindsOptions = [
    { label: 'Admin', value: GROUP_KIND_ADMIN },
    { label: 'Manager', value: GROUP_KIND_MANAGER },
    { label: 'User', value: GROUP_KIND_USER },
];

export const PROVINCE_KIND = 1;
export const DISTRICT_KIND = 2;
export const VILLAGE_KIND = 3;

export const SYLLABUS_KIND_SESSION = 1;
export const SYLLABUS_KIND_LECTURE = 2;
export const CATEGORY_KIND_SLIDER = 8;

export const SettingTypes = {
    Money: 'Money',
    Timezone: 'Timezone',
    System: 'System',
};

export const formSize = {
    small: '600px',
    normal: '700px',
    big: '1200px',
    editor: '1000px',
};
