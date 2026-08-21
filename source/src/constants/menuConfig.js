import { UsergroupAddOutlined, SettingOutlined, BookOutlined, BarChartOutlined, ToolOutlined } from '@ant-design/icons';
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
            },
             {
                label: <FormattedMessage defaultMessage="Học viên" />,
                key: 'student',
                path: routes.studentListPage.path,
                permission: [apiConfig.student.getList.permissionCode],
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
            {
                label: <FormattedMessage defaultMessage="Đăng ký" />,
                key: 'registration',
                path: routes.registrationListPage.path,
                permission: [apiConfig.registration.getList.permissionCode],
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
            },
            {
                label: <FormattedMessage defaultMessage="Top khoá học" />,
                key: 'topCourse',
                path: routes.topCourseListPage.path,
                permission: [apiConfig.report.getTopCourse.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'system-management',
        icon: <SettingOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Công ty" />,
                key: 'company',
                path: routes.companyListPage.path,
                permission: [apiConfig.company.getList.permissionCode],
                isSuperAdmin: true,
            },
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
            {
                label: <FormattedMessage defaultMessage="Thẻ" />,
                key: 'tag',
                path: routes.tagListPage.path,
                permission: [apiConfig.tag.getList.permissionCode],
                isSuperAdmin: true,
            },
            {
                label: <FormattedMessage defaultMessage="Slider" />,
                key: 'slider',
                path: routes.categoryListPage.path,
                permission: [apiConfig.category.getList.permissionCode],
                isSuperAdmin: true,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý thiết bị" />,
        key: 'device-management',
        icon: <ToolOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Thiết bị" />,
                key: 'device',
                path: routes.deviceListPage.path,
                permission: [apiConfig.category.getList.permissionCode],
                isSuperAdmin: true,
            },
        ],
    },
];
