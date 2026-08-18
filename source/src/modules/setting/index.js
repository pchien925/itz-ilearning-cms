import React, { useMemo, useState, useEffect } from 'react';
import { Tabs, Card, Spin } from 'antd';
import { PageWrapper } from '@itz/react-cms-element';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import { settingGroups } from '@constants/masterData';
import PageConfigSavePage from './PageConfigSavePage';
import styles from './SettingsIndex.module.scss';

const SettingsIndex = ({ pageOptions }) => {
    const translate = useTranslate();
    const [activeTabGroup, setActiveTabGroup] = useState(settingGroups.PAGE);


    const { data: listResponse, loading } = useFetch(apiConfig.setting.getList, {
        immediate: true,
        params: {
            page: 0,
            size: 1000,
        },
    });

    const allSettings = listResponse?.data?.content || [];


    const activeGroupSettings = useMemo(() => {
        return allSettings.filter((item) => item.groupName === activeTabGroup);
    }, [allSettings, activeTabGroup]);

    const getTabLabel = (groupNameValue, fallbackName) => {
        const record = allSettings.find((item) => item.groupName === groupNameValue);

        if (record?.keyName) {
            const formattedText = record.keyName.replace(/_/g, ' ');
            return formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
        }

        return fallbackName;
    };

    const tabItems = useMemo(() => {
        const allTabs = [
            {
                key: settingGroups.PAGE,
                label: getTabLabel(settingGroups.PAGE, 'Page config'),
                children: <PageConfigSavePage tabData={activeGroupSettings} />,
            },
            {
                key: settingGroups.GENERAL,
                label: getTabLabel(settingGroups.GENERAL, 'Cài đặt chung'),
                children: <div>Nội dung của tab Cài đặt chung sẽ nằm ở đây...</div>,
            },
            {
                key: settingGroups.REVENUE,
                label: getTabLabel(settingGroups.REVENUE, 'Cấu hình doanh thu'),
                children: <div>Nội dung của tab Cấu hình doanh thu sẽ nằm ở đây...</div>,
            },
            {
                key: settingGroups.TRAINING,
                label: getTabLabel(settingGroups.TRAINING, 'Cấu hình đào tạo'),
                children: <div>Nội dung của tab Cấu hình đào tạo sẽ nằm ở đây...</div>,
            },
            {
                key: settingGroups.BBB,
                label: getTabLabel(settingGroups.BBB, 'Cấu hình BBB'),
                children: <div>Nội dung của tab Cấu hình BBB sẽ nằm ở đây...</div>,
            },
        ];

        return allTabs.filter((tab) => allSettings.some((item) => item.groupName === tab.key));
    }, [allSettings]);

    useEffect(() => {
        if (loading) return;
        if (tabItems.length > 0 && !tabItems.some((tab) => tab.key === activeTabGroup)) {
            setActiveTabGroup(tabItems[0].key);
        }
    }, [tabItems, loading]);

    return (
        <PageWrapper routes={pageOptions ? pageOptions.renderBreadcrumbs(commonMessage, translate) : []}>
            <Spin spinning={loading}>
                <Tabs
                    className={styles.customTabs}
                    type="card"
                    activeKey={activeTabGroup}
                    onChange={(key) => setActiveTabGroup(key)}
                    items={tabItems}
                    destroyInactiveTabPane={true}
                />
            </Spin>
        </PageWrapper>
    );
};

export default SettingsIndex;