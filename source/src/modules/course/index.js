import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, TextClamp, AvatarField } from '@itz/react-cms-element';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, Tag } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import { AppConstants } from '@constants';
import { formatMoney } from '@itz/react-utils';

const CourseListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.course,
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.course.update.permissionCode]);

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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.course.delete.permissionCode]);
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
            width: 50,
            render: (_, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: 'avatar',
            align: 'left',
            width: 50,
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
            width: 500,
            render: (name, record) => {
                if (!record.name) return '-';
                return (
                    <div
                        style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 400 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = record.id;
                            const encodedName = encodeURIComponent(name);
                            navigate(mixinFuncs.getItemDetailLink(record), {
                                state: { action: 'edit', prevPath: location.pathname },
                            });
                        }}
                    >
                        <TextClamp lineClamp={2}>{name}</TextClamp>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeline),
            dataIndex: 'totalTimeline',
            width: 150,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.price),
            dataIndex: 'price',
            width: 150,
            align: 'right',
            render: (price) => {
                if (price == null) return '-';
                return formatMoney(price, {
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    currentcy: 'đ',
                });
            },
        },
        mixinFuncs.renderStatusColumn({ width: 120 }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 120, align: 'center' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.courseName),
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

export default CourseListPage;