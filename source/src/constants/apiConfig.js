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
    mentor: {
        getMentorList: {
            baseURL: `${apiUrl}v1/mentor/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'MEN_L',
        }, getList: {
            baseURL: `${apiUrl}v1/mentor/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'MEN_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/mentor/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'MEN_V',
        },
        create: {
            baseURL: `${apiUrl}v1/mentor/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'MEN_C',
        },
        update: {
            baseURL: `${apiUrl}v1/mentor/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'MEN_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/mentor/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'MEN_D',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/mentor/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/mentor/profile`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    classroom: {
        update: {
            baseURL: `${apiUrl}v1/class-room/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'CLR_U',
        },
        changeState: {
            baseURL: `${apiUrl}v1/class-room/change-state`,
            method: 'PUT',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/class-room/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'CLR_C',
        },
        getPublicList: {
            baseURL: `${apiUrl}v1/class-room/public/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/class-room/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'CLR_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/class-room/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'CLR_V',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/class-room/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/class-room/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'CLR_D',
        },
    },
    classroomStudent: {
        changeState: {
            baseURL: `${apiUrl}v1/classroom-student/change-state`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'CLS_U',
        },
        registerFromRegistration: {
            baseURL: `${apiUrl}v1/classroom-student/register-from-registration`,
            method: 'POST',
            headers: baseHeader,
        },
        registerByStudent: {
            baseURL: `${apiUrl}v1/classroom-student/register-by-student`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'CLS_C',
        },
        getList: {
            baseURL: `${apiUrl}v1/classroom-student/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'CLS_L',
        },
        delete: {
            baseURL: `${apiUrl}v1/classroom-student/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'CLS_D',
        },
    },
    course: {
        update: {
            baseURL: `${apiUrl}v1/course/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'COU_U',
        },
        create: {
            baseURL: `${apiUrl}v1/course/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'COU_C',
        },
        getList: {
            baseURL: `${apiUrl}v1/course/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'COU_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/course/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'COU_V',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/course/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/course/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'COU_D',
        },
    },
    student: {
        update: {
            baseURL: `${apiUrl}v1/student/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'STU_U',
        },
        create: {
            baseURL: `${apiUrl}v1/student/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'STU_C',
        },
        profile: {
            baseURL: `${apiUrl}v1/student/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/student/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'STU_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/student/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'STU_V',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/student/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/student/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'STU_D',
        },
    },
    syllabus: {
        updateOrdering: {
            baseURL: `${apiUrl}v1/syllabus/update-ordering`,
            method: 'PUT',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/syllabus/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'SYL_U',
        },
        create: {
            baseURL: `${apiUrl}v1/syllabus/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'SYL_C',
        },
        getPublicList: {
            baseURL: `${apiUrl}v1/syllabus/public/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/syllabus/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SYL_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/syllabus/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SYL_V',
        },
        delete: {
            baseURL: `${apiUrl}v1/syllabus/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'SYL_D',
        },
    },
    rating: {
        update: {
            baseURL: `${apiUrl}v1/rating/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'RAT_U',
        },
        create: {
            baseURL: `${apiUrl}v1/rating/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'RAT_C',
        },
        getPublicList: {
            baseURL: `${apiUrl}v1/rating/public/list`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}v1/rating/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'RAT_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/rating/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'RAT_V',
        },
        delete: {
            baseURL: `${apiUrl}v1/rating/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'RAT_D',
        },
    },
    report: {
        getTopStudent: {
            baseURL: `${apiUrl}v1/report/top-student`,
            method: 'GET',
            headers: baseHeader,
        },
        getTopCourse: {
            baseURL: `${apiUrl}v1/report/top-course`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'RPT_L',
        },
        exportExcelTopStudent: {
            baseURL: `${apiUrl}v1/report/export-excel-top-student`,
            method: 'GET',
            headers: baseHeader,
            responseType: 'blob',
        },
        exportExcelTopCourse: {
            baseURL: `${apiUrl}v1/report/export-excel-top-course`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    setting: {
        update: {
            baseURL: `${apiUrl}v1/setting/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'SET_U',
        },
        create: {
            baseURL: `${apiUrl}v1/setting/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'SET_C',
        },
        getPublic: {
            baseURL: `${apiUrl}v1/setting/public`,
            method: 'GET',
            headers: baseHeader,
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
        findByKey: {
            baseURL: `${apiUrl}v1/setting/find-by-key`,
            method: 'GET',
            headers: baseHeader,
        },
        findByGroup: {
            baseURL: `${apiUrl}v1/setting/find-by-group`,
            method: 'GET',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/setting/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
};

export default apiConfig;
