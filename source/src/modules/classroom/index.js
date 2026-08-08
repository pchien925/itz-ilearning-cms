import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, TextClamp } from '@itz/react-cms-element';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { classroomStateOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, Tag } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/useFetch';

const ClassroomListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const stateValue = translate.formatKeys(classroomStateOptions, ['label']);

    const { data: courseListData } = useFetch(apiConfig.course.getList, {
        immediate: true,
        mappingData: (response) => response?.data?.content || [],
    });

    const courseOptions = (courseListData || []).map((c) => ({
        value: String(c.id),
        label: c.name,
    }));


    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.classroom,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create${search}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params });
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {

                    const canEdit = record.state === 0;

                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.update.permissionCode]);

                    const isDisabled = !hasPerm || !canEdit;

                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(record), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                                type="link"
                                style={{ padding: 0 }}
                                disabled={isDisabled}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record.id);
                                }}
                                disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: !hasPerm ? '' : 'red' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },

            });
        },
    });

    const columns = [
        {
            title: '#',
            align: 'left',
            width: 40,
            render: (_, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: translate.formatMessage(commonMessage.course),
            dataIndex: ['course', 'name'],
            width: 500,
            render: (name, record) => {
                if (!record.course) return '-';
                return (
                    <div
                        style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = record.id;
                            // Mã hóa tên để đưa lên query param (đổi khoảng trắng thành %20, v.v.)
                            const encodedName = encodeURIComponent(name);
                            navigate(`/classroom/${id}/student?classroomName=${encodedName}`);
                        }}
                    >
                        <TextClamp lineClamp={2}>{name}</TextClamp>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            width: 140,
            render: (date) => date || '-',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            width: 140,
            render: (date) => date || '-',
        },
        {
            title: translate.formatMessage(commonMessage.price),
            dataIndex: 'price',
            width: 140,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            width: 160,
            align: 'center',
            render: (stateValue) => {
                const option = classroomStateOptions.find((item) => item.value === stateValue);
                if (!option) return null;
                return (
                    <Tag color={option.color} style={{ display: 'inline-block', width: '100%', textAlign: 'center', fontSize: 14 }}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {translate.formatMessage(option.label)}
                        </div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 150, align: 'right' },
        ),
    ];

    const searchFields = [
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.course),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            mappingOptions: (item) => ({ label: item.name, value: item.id }),
            useFetch: useFetch,
            submitOnChanged: true,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValue,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ClassroomListPage;