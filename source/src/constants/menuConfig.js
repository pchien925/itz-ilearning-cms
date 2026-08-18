import { UsergroupAddOutlined, SettingOutlined, BookOutlined, BarChartOutlined } from '@ant-design/icons';
import routes from '@routes';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';

export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý người dùng" />,
        key: 'user-management',
        icon: <UsergroupAddOutlined />,
        permission: [
            apiConfig.account.getList.permissionCode,
            apiConfig.mentor.getList.permissionCode,
        ],
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản trị viên" />,
                key: 'admin',
                path: routes.adminListPage.path,
                permission: [apiConfig.account.getList.permissionCode],
                isSuperAdmin: true,
            },
            {
                label: <FormattedMessage defaultMessage="Mentor" />,
                key: 'mentor',
                path: routes.mentorListPage.path,
                permission: [apiConfig.mentor.getList.permissionCode],
                isSuperAdmin: false,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý khoá học" />,
        key: 'classroom-management',
        icon: <BookOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Khoá học" />,
                key: 'course',
                path: routes.courseListPage.path,
                permission: [apiConfig.course.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Lớp học" />,
                key: 'classroom',
                path: routes.classroomListPage.path,
                permission: [apiConfig.classroom.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Đánh giá" />,
                key: 'rating',
                path: routes.ratingListPage.path,
                permission: [apiConfig.rating.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Báo cáo" />,
        key: 'report',
        icon: <BarChartOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Top học viên" />,
                key: 'topStudent',
                path: routes.topStudentListPage.path,
                // permission: [apiConfig.rating.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'system-management',
        icon: <SettingOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quyền" />,
                key: 'group-permission',
                path: routes.groupPermissionListPage.path,
                permission: [apiConfig.groupPermission.getGroupList.permissionCode],
                isSuperAdmin: true,
            },
            {
                label: <FormattedMessage defaultMessage="Cài đặt" />,
                key: 'setting',
                path: routes.settingsPage.path,
                permission: [apiConfig.setting.getList.permissionCode],
                isSuperAdmin: true,
            },
        ],
    },
];
