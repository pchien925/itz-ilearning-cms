import { DeleteOutlined, EditOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, AvatarField, TextField } from '@itz/react-cms-element';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, KIND_ADMIN, STATUS_DELETE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderNumber } from '@itz/react-utils';

const StudentListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.student,
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
            const originalChangeFilter = funcs.changeFilter;
            funcs.changeFilter = (filter) => {
                originalChangeFilter({ ...filter, page: 1 });
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.student.update.permissionCode]);
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
                                disabled={!hasPerm}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.student.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record.id);
                                }}
                                disabled={!hasPerm || isDelete}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: (!hasPerm || isDelete) ? '' : 'red' }} />
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
            width: 60,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: ['account', 'avatarPath'],
            align: 'left',
            width: 80,
            render: (avatar) => {
                return (
                    <AvatarField
                        size="default"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.avatarRootUrl}${avatar}` : null}
                    />
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: ['account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: ['account', 'email'],
            width: '240px',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: ['account', 'phone'], width: 200,
        },
        mixinFuncs.renderStatusColumn({ width: 160 }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 180, align: 'center' },
        ),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.fullName),
        },
        {
            key: 'email',
            placeholder: translate.formatMessage(commonMessage.email),
            type: FieldTypes.STRING,
            renderItem: () => <TextField placeholder={translate.formatMessage(commonMessage.email)} />,
        },
        {
            key: 'phone',
            placeholder: translate.formatMessage(commonMessage.phoneNumber),
            type: FieldTypes.STRING,
            renderItem: () => <TextField placeholder={translate.formatMessage(commonMessage.phoneNumber)} />,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValue,
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

export default StudentListPage;