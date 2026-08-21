import { BaseTable, PageWrapper, ListPage, TextClamp, AvatarField } from '@itz/react-cms-element';
import { FileExcelOutlined, UserOutlined } from '@ant-design/icons';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import { sendRequest } from '@services/api';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Empty, Button } from 'antd';
import React from 'react';
import useFetch from '@hooks/useFetch';
import { orderNumber } from '@itz/react-utils';

const TopCourseListPage = ({ pageOptions }) => {
    const translate = useTranslate();

    const { data, queryFilter, mixinFuncs, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.report.getTopCourse,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions?.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data,
                        total: response.data.length,
                    };
                }
            };
        },
    });

    const handleExportExcel = async () => {
        try {
            const { data, error } = await sendRequest(
                apiConfig.report.exportExcelTopCourse,
                {
                    params: {},
                    mixinFuncs: { responseType: 'blob' },
                },
            );

            if (error || !data) {
                throw new Error('No data returned');
            }

            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `top-course.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export excel failed', error);
        }
    };

    mixinFuncs.renderActionBar = () => {
        return (
            <Button
                style={{
                    border: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                }}
                type="default"
                icon={<FileExcelOutlined style={{ color: '#1D6F42', fontSize: 24 }} />}
                onClick={handleExportExcel}
            />
        );
    };



    const columns = [
        {
            title: '#',
            align: 'left',
            width: 60,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: 'avatar',
            align: 'left',
            width: 80,
            render: (avatar) => {
                return (
                    <AvatarField
                        size="large"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.avatarRootUrl}${avatar}` : null}
                    />
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'name',
            width: 1100,
            render: (name, record) => {
                if (!record.name) return '-';
                return (

                    <TextClamp lineClamp={2}>{name}</TextClamp>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.reportTopCourseTotalStudents),
            dataIndex: 'totalStudents',
            align: 'right',
            // width: 270,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={false}
                        locale={{
                            emptyText: <Empty description="Không có dữ liệu" />,
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default TopCourseListPage;