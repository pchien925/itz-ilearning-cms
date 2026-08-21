import { DeleteOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, AvatarField, TextClamp } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';

import { commonMessage } from '@locales/intl';
import { Button, Empty, Tag, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { orderNumber } from '@itz/react-utils';

const BrandDeviceListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { id } = useParams();
    const navigate = useNavigate();
    const kind = pageOptions?.kind;
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayName] = useState(searchParams.get('deviceName'));
    const statusValue = translate.formatKeys(statusOptions, ['label']);

    useEffect(() => {
        if (!displayName) return;

        const keys = Array.from(searchParams.keys());
        const isAlreadyCorrect =
            keys[0] === 'deviceName' && searchParams.get('deviceName') === displayName;

        if (isAlreadyCorrect) return;

        setSearchParams((prev) => {
            const next = new URLSearchParams();
            next.set('deviceName', displayName);
            prev.forEach((value, key) => {
                if (key !== 'deviceName') next.set(key, value);
            });
            return next;
        }, { replace: true });
    }, [searchParams, displayName, setSearchParams]);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.category,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            const originalSetQueryParams = funcs.setQueryParams;
            funcs.setQueryParams = (queryObj) => {
                const { deviceName: _ignored, ...restParams } = queryObj || {};
                const merged = {
                    ...(displayName ? { deviceName: displayName } : {}),
                    ...restParams,
                };
                return originalSetQueryParams(merged);
            };

            const originalChangeFilter = funcs.changeFilter;

            funcs.changeFilter = (filter) => {
                return originalChangeFilter({ ...filter, page: 1 });
            };
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
                mixinFuncs.handleFetchList({
                    ...params,
                    kind: kind,
                    parentId: id,
                });
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.category.update.permissionCode]);

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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.category.delete.permissionCode]);
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
            width: 60,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
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
            title: translate.formatMessage(commonMessage.brandName),
            dataIndex: 'name',
            render: (name) => (
                <span>
                    <TextClamp lineClamp={2}>{name}</TextClamp>
                </span>
            ),
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
            placeholder: translate.formatMessage(commonMessage.brandName),
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
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate, displayName)}>
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

export default BrandDeviceListPage;