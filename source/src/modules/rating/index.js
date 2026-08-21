import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, TextClamp } from '@itz/react-cms-element';
import StarRating from '@components/StarRating/StarRating';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import { FieldTypes } from '@constants/formConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { commonMessage } from '@locales/intl';
import { Button, Empty } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { convertUtcToLocalTime, DEFAULT_FORMAT, orderNumber, showErrorMessage, showSuccessMessage } from '@itz/react-utils';
import RatingModal from './RatingModal';

const RatingListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const objectName = translate.formatMessage(pageOptions?.objectName || { id: 'rating', defaultMessage: 'Đánh giá' });

    const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Đưa hook gọi API Create & Update lên Page
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.rating.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.rating.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.rating,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: objectName,
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
                        <BaseTooltip type="edit" objectName={objectName}>
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
                        <BaseTooltip type="delete" objectName={objectName}>
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
        setIsEditing(false);
        setSelectedItem(null);
        openModal();
    };

    const openEditModal = (record) => {
        setIsEditing(true);
        setSelectedItem(record);
        openModal();
    };

    const handleCloseModal = () => {
        closeModal();
        setSelectedItem(null);
    };

    // Hàm xử lý Submit tập trung tại Page
    const onSubmit = async (values, callback) => {
        const execute = isEditing ? executeUpdate : executeCreate;
        const payload = {
            studentId: values.student,
            courseId: values.course,
            star: values.star,
            message: values.ratingContent,
        };

        if (isEditing) {
            payload.id = selectedItem?.id;
        }

        await execute({
            data: payload,
            onCompleted: (response) => {
                if (response.result === true) {
                    closeModal();
                    showSuccessMessage(
                        isEditing
                            ? translate.formatMessage(commonMessage.updateSuccess)
                            : translate.formatMessage(commonMessage.addNewSuccess),
                    );
                    mixinFuncs.getList();
                }
            },
            onError: (err) => {
                const errorInfo = errorCode[err?.code];
                if (errorInfo) {
                    showErrorMessage(translate.formatMessage(errorInfo.message));
                } else {
                    showErrorMessage(err?.message || translate.formatMessage(commonMessage.commonError));
                }
                callback?.(err);
            },
        });
    };

    mixinFuncs.renderActionBar = () => {
        if (!mixinFuncs.hasPermission([apiConfig.rating.create.permissionCode])) return null;
        
        return (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
                    {translate.formatMessage(commonMessage.addNew)}
                </Button>
            </div>
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
            title: translate.formatMessage(commonMessage.student),
            dataIndex: ['student', 'account', 'fullName'],
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.course),
            dataIndex: ['course', 'name'],
            width: 600,
            render: (name, record) => {
                if (!record.course?.name) return '-';
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
                return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
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
            {/* Truyền các props theo đúng chuẩn của Modal mới */}
            <RatingModal
                open={isModalOpen}
                close={handleCloseModal}
                dataDetail={selectedItem}
                isEditing={isEditing}
                onSubmit={onSubmit}
                isSubmitting={loadingCreate || loadingUpdate}
                objectName={objectName?.toLowerCase()}
            />
        </PageWrapper>
    );
};

export default RatingListPage;