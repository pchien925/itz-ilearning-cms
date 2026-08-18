import { BaseTable, PageWrapper, ListPage, TextClamp } from '@itz/react-cms-element';
import { FileExcelOutlined } from '@ant-design/icons';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Empty, Button } from 'antd';
import React from 'react';
import useFetch from '@hooks/useFetch';

const TopStudentListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { execute: executeExportExcel } = useFetch(apiConfig.report.exportExcelTopStudent);

    const { data, queryFilter, mixinFuncs, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.report.getTopStudent,
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
            const data = await executeExportExcel();
            console.log('data: ',data);

            if (!data) {
                throw new Error('No data returned');
            }

            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `top-student-${Date.now()}.xlsx`);
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
            render: (_, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: translate.formatMessage(commonMessage.student),
            dataIndex: 'fullName',
            width: 450,
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: 'email',
            render: (email) => email || '-',
        },
        {
            title: translate.formatMessage(commonMessage.totalEnrolledClasses),
            dataIndex: 'totalEnrolledClasses',
            align: 'right',
            width: 270,
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

export default TopStudentListPage;