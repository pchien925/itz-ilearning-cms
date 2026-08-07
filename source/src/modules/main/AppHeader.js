import {
    DownOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Menu, Space } from 'antd';
import React from 'react';
const { Header } = Layout;

import { AppConstants } from '@constants';
import useAuth from '@hooks/useAuth';
import useFilterStorage from '@hooks/useFilterStorage';
import useTranslate from '@hooks/useTranslate';
import useValidatePermission from '@hooks/useValidatePermission';
import { removeCacheToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.scss';

const message = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
    locale: '{locale, select, en {Vietnamese} other {English}}',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const translate = useTranslate();
     const { clearAllFilters } = useFilterStorage();

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
    };

    const validatePermission = useValidatePermission();

    function makeNavs(navs) {
        return navs.map((nav) => {
            const newNav = { ...nav };
            if (newNav.permission || newNav.kind) {
                if (!validatePermission(newNav.permission)) {
                    return null;
                }
            }
            if (newNav.children) {
                newNav.children = makeNavs(nav.children);
                if (newNav.children.every((item) => item === null)) {
                    return null;
                }
            }

            return newNav;
        });
    }

    const navMenuConfig = [
        {
            key: 'menu',
            label: (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        src={profile.avatarPath && `${AppConstants.contentRootUrl}${profile.avatarPath}`}
                    />
                    {profile?.fullName}
                    <DownOutlined />
                </Space>
            ),
            children: [
                {
                    label: translate.formatMessage(message.profile),
                    icon: <UserOutlined />,
                    key: 'profile',
                    onClick: () => {
                        clearAllFilters();
                        navigate('/profile');
                    },
                },
                {
                    label: translate.formatMessage(message.logout),
                    icon: <LoginOutlined />,
                    key: 'logout',
                    onClick: onLogout,
                },
            ].filter(Boolean),
        },
    ];

    return (
        <Header className={styles.appHeader} style={{ padding: 0, background: 'white' }}>
            <span className={styles.iconCollapse} onClick={onCollapse}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu mode="horizontal" className={styles.rightMenu} selectedKeys={[]} items={makeNavs(navMenuConfig)} />
        </Header>
    );
};

export default AppHeader;
