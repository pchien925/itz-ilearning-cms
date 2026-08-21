import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { PageWrapper, ListPage, BaseTooltip, AvatarField, TextClamp, DragDropTableV2 } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useDragDrop from '@hooks/useDragDrop';


const SliderListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const search = location.search;
    const { pathname: pagePath } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const kind = pageOptions?.kind;
    const { data, mixinFuncs, queryFilter, loading } = useListBase({
        apiConfig: apiConfig.category,
        options: {
            pageSize: 1000,
            objectName: translate.formatMessage(pageOptions?.objectName),
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
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    ...params,
                    kind: kind,
                });
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create${search}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.category.update.permissionCode]);

                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions?.objectName)}>
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
                                <EditOutlined style={{ color: !hasPerm ? '' : '#1890ff' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.category.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions?.objectName)}>
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

            funcs.renderActionBar = () => {
                const hasCreatePerm = mixinFuncs.hasPermission([apiConfig.category.create.permissionCode]);

                return (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getCreateLink(), {
                                        state: { action: 'add', prevPath: location.pathname },
                                    });
                                }}
                            disabled={!hasCreatePerm}
                        >
                            Thêm mới
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loadingUpdateOrder}
                            onClick={() => handleUpdate(sortedData, false)}
                        >
                            Cập nhật vị trí
                        </Button>
                    </div>
                );
            };
        },
    });

    const {
        sortedData,
        handleUpdate,
        sortColumn,
        loading: loadingUpdateOrder,
        onDragEnd,
    } = useDragDrop({
        data: data,
        apiConfig: apiConfig.category.updateOrdering,
        indexField: 'ordering',
        onUpdateSuccess: () => {
            mixinFuncs.getList();
        },
    });

    const handleDragEnd = (active, over) => {
        if (active && over && active.id !== over.id) {
            onDragEnd({ id: active.id }, { id: over.id });
        }
    };

    const columns = [
        sortColumn,
        {
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: 'avatar',
            width: 100,
            align: 'left',
            render: (avatar, record) => {
                const isChapter = record.kind === 1;
                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: isChapter ? 'flex-start' : 'flex-end',
                            padding: '0 8px',
                        }}
                    >
                        <AvatarField
                            size="large"
                            icon={<UserOutlined />}
                            src={avatar ? `${AppConstants.avatarRootUrl}${avatar}` : null}
                        />
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.sliderName),
            dataIndex: 'name',
            render: (name) => (
                <span>
                    <TextClamp lineClamp={2}>{name}</TextClamp>
                </span>
            ),
        },
        mixinFuncs.renderStatusColumn({ width: 160 }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 140, align: 'center' },
        ),
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>

            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: [], initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                        dataSource={sortedData}
                        onDragEnd={handleDragEnd}
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={false}
                        scroll={{ x: false }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default SliderListPage;