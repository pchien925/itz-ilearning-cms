import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, TextClamp } from '@itz/react-cms-element';
import StarRating from '@components/StarRating/StarRating';
import { DEFAULT_TABLE_ITEM_SIZE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { commonMessage } from '@locales/intl';
import { Button, Empty } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RatingModal from './RatingModal';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const RatingListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();

    const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.rating,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions?.objectName || { id: 'rating', defaultMessage: 'Đánh giá' }),
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
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.rating.update.permissionCode]);

                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions?.objectName || { id: 'rating', defaultMessage: 'Đánh giá' })}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(record);
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.rating.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions?.objectName || { id: 'rating', defaultMessage: 'Đánh giá' })}>
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

    const openAddModal = () => {
        setEditingRecord(null);
        openModal();
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        openModal();
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingRecord(null);
    };

    mixinFuncs.renderActionBar = () => {
        return (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                    Thêm mới
                </Button>
            </div>
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
            dataIndex: ['student', 'account', 'fullName'],
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.course),
            dataIndex: ['course', 'name'],
            width: 600,
            render: (name, record) => {
                if (!record.course.name) return '-';
                return (
                    <TextClamp lineClamp={2}>{name}</TextClamp>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.star),
            align: 'center',
            width: 100,
            dataIndex: 'star',
            render: (value) => <StarRating value={value} />,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: 140,
            render: (date) => {
                if (!date) return '-';
                return dayjs.utc(date, DEFAULT_FORMAT).local().format(DEFAULT_FORMAT);
            },
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 140, align: 'center' },
        ),
    ];

    const searchFields = [
        {
            key: 'courseId',
            placeholder: 'Khóa học',
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            mappingOptions: (item) => ({ label: item.name, value: item.id }),
            useFetch: useFetch,
            submitOnChanged: true,
        },
        {
            key: 'studentId',
            placeholder: 'Học viên',
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.student.autocomplete,
            mappingOptions: (item) => ({ label: item.account?.fullName, value: item.id }),
            useFetch: useFetch,
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
                            emptyText: <Empty description="Không có dữ liệu" />,
                        }}
                    />
                }
            />
            <RatingModal
                open={isModalOpen}
                onCancel={handleCloseModal}
                editingRecord={editingRecord}
                onSuccess={mixinFuncs.getList}
                translate={translate}
                commonMessage={commonMessage}
            />
        </PageWrapper>
    );
};

export default RatingListPage;