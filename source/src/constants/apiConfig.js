import { AppConstants, apiUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

const apiConfig = {
    account: {
        loginBasic: {
            baseURL: `${apiUrl}api/token`,
            method: 'POST',
            headers: baseHeader,
        },
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'ACC_U_AD',
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ACC_V',
        },
        getList: {
            baseURL: `${apiUrl}v1/account/list`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'ACC_L',
        },
        createAdmin: {
            baseURL: `${apiUrl}v1/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'ACC_C_AD',
        },
        updateAdmin: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'ACC_U_AD',
        },
        delete: {
            baseURL: `${apiUrl}v1/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            permissionCode: 'ACC_D',
        },
    },
    file: {
        upload: {
            path: `${apiUrl}v1/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
            // permissionCode: 'FILE_U',
        },
        image: {
            baseURL: `${AppConstants.mediaRootUrl}admin/v1/image/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
        video: {
            baseURL: `${AppConstants.mediaRootUrl}admin/v1/video/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
    },
    groupPermission: {
        getGroupList: {
            baseURL: `${apiUrl}v1/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getList: {
            baseURL: `${apiUrl}v1/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getPermissionList: {
            baseURL: `${apiUrl}v1/permission/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'PER_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/group/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_V',
        },
        create: {
            baseURL: `${apiUrl}v1/group/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'GR_C',
        },
        update: {
            baseURL: `${apiUrl}v1/group/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'GR_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/group/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'GR_D',
        },
        getGroupListCombobox: {
            baseURL: `${apiUrl}v1/group/list_combobox`,
            method: 'GET',
            headers: baseHeader,
        },
        autoComplete: {
            baseURL: `${apiUrl}v1/group/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    settings: {
        getSettingsList: {
            baseURL: `${apiUrl}v1/setting/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_L',
        },
        getList: {
            baseURL: `${apiUrl}v1/setting/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/setting/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_V',
        },
        create: {
            baseURL: `${apiUrl}v1/setting/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'SET_C',
        },
        update: {
            baseURL: `${apiUrl}v1/setting/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'SET_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/setting/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/setting/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getByKey: {
            baseURL: `${apiUrl}v1/setting/find-by-key`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_V',
        },
    },
};

export default apiConfig;
