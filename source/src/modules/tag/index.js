import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, AvatarField, TextField } from '@itz/react-cms-element';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, KIND_ADMIN, STATUS_DELETE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, ColorPicker } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { showSuccessMessage, showErrorMessage, orderNumber } from '@itz/react-utils';
import TagModal from './TagModal';


const TagListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const [editingRecord, setEditingRecord] = useState(null);
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.tag.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.tag.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.tag,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.renderActionBar = () => {
                return (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openAddModal}
                        >
                            Thêm mới
                        </Button>
                    </div>
                );
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
            const originalChangeFilter = funcs.changeFilter;
            funcs.changeFilter = (filter) => {
                originalChangeFilter({ ...filter, page: 1 });
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.tag.update.permissionCode]);
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(record);
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.tag.delete.permissionCode]);
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

    const handleCloseModal = () => {
        closeModal();
        setEditingRecord(null);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        openModal();
    };

    const openAddModal = () => {
        setEditingRecord(null);
        openModal();
    };

    const handleSubmit = (values) => {
        const payload = {
            ...values,
        };

        if (editingRecord) {
            executeUpdate({
                data: {
                    ...payload,
                    id: editingRecord.id,
                },
                onCompleted: (response) => {
                    if (response.result === true) {
                        showSuccessMessage('Cập nhật thẻ thành công!');
                        handleCloseModal();
                        mixinFuncs.getList();
                    } else {
                        showErrorMessage('Cập nhật thẻ thất bại!');
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra!');
                },
            });
        } else {
            executeCreate({
                data: {
                    ...payload,
                },
                onCompleted: (response) => {
                    if (response.result === true) {
                        showSuccessMessage('Thêm mới thẻ thành công!');
                        handleCloseModal();
                        mixinFuncs.getList();
                    } else {
                        showErrorMessage('Thêm mới thẻ thất bại!');
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra!');
                },
            });
        }
    };




    const columns = [
        {
            title: '#',
            align: 'left',
            width: 60,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
        },
        {
            title: translate.formatMessage(commonMessage.tagName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.colorCode),
            dataIndex: 'colorCode',
            render: (colorCode) => (
                colorCode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                backgroundColor: colorCode,
                            }}
                        />
                        <span>
                            {colorCode}
                        </span>
                    </div>
                ) : null
            ),
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
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.tagName),
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
            <TagModal
                open={isModalOpen}
                close={handleCloseModal}
                dataDetail={editingRecord}
                isEditing={!!editingRecord}
                onSubmit={handleSubmit}
                isSubmitting={loadingCreate || loadingUpdate}
                objectName={translate.formatMessage(pageOptions?.objectName || { id: 'tag', defaultMessage: 'Thẻ' })}
            />
        </PageWrapper>

    );
};

export default TagListPage;