import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { PageWrapper, ListPage, BaseTooltip, AvatarField, TextClamp, DragDropTableV2 } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import classNames from 'classnames/bind';
import apiConfig from '@constants/apiConfig';
import { syllabusKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import useDragDrop from '@hooks/useDragDrop';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { showSuccessMessage, showErrorMessage } from '@itz/react-utils';
import SyllabusModal from './SyllabusModal';
import styles from './main.module.scss';

const cx = classNames.bind(styles);

const SyllabusDragDropPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const courseName = searchParams.get('courseName');
    const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const syllabusValue = translate.formatKeys(syllabusKindOptions, ['label']);

    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.syllabus.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.syllabus.update);

    const { data, mixinFuncs, queryFilter, loading } = useListBase({
        apiConfig: apiConfig.syllabus,
        options: {
            pageSize: 1000,
            objectName: translate.formatMessage(pageOptions?.objectName || { id: 'syllabus', defaultMessage: 'Giáo trình' }),
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
                    courseId: id,
                });
            };
            funcs.prepareDeleteParams = (deleteId) => {
                const record = sortedData.find((item) => item.id === deleteId);
                const chapterId = record?.kind === 2 ? getNearestChapterId(sortedData, deleteId) : 0;

                return { chapterId };
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.syllabus.update.permissionCode]);

                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions?.objectName || { id: 'syllabus', defaultMessage: 'Giáo trình' })}>
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.syllabus.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions?.objectName || { id: 'syllabus', defaultMessage: 'Giáo trình' })}>
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

    const {
        sortedData,
        handleUpdate,
        sortColumn,
        loading: loadingUpdateOrder,
        onDragEnd,
    } = useDragDrop({
        data: data,
        apiConfig: apiConfig.syllabus.updateOrdering,
        indexField: 'ordering',
        validateOrder: (list) => list.length === 0 || list[0]?.kind === 1,
        invalidOrderMessage: 'Chương phải luôn đứng đầu danh sách!',
        getExtraFields: (item, index, sortList) => {
            let currentChapterId = 0;
            if (item.kind === 2) {
                for (let i = index - 1; i >= 0; i--) {
                    if (sortList[i].kind === 1) {
                        currentChapterId = sortList[i].id;
                        break;
                    }
                }
            } else if (item.kind === 1) {
                currentChapterId = 0;
            }
            return { chapterId: currentChapterId };
        },
        onUpdateSuccess: () => {
            mixinFuncs.getList();
        },
    });

    const handleDragEnd = (active, over) => {
        if (active && over && active.id !== over.id) {
            onDragEnd({ id: active.id }, { id: over.id });
        }
    };

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

    const getNearestChapterId = (list, currentId) => {
        const index = list.findIndex((item) => item.id === currentId);
        if (index === -1) return 0;

        for (let i = index - 1; i >= 0; i--) {
            if (list[i].kind === 1) {
                return list[i].id;
            }
        }
        return 0;
    };

    const handleSubmit = (values) => {
        const totalItems = sortedData?.length || 0;
        let chapterId = 0;

        if (values.kind === 2 && editingRecord) {
            chapterId = getNearestChapterId(sortedData, editingRecord.id);
        }

        const payload = {
            ...values,
            courseId: id,
            chapterId,
            timeline: values.timeline ?? 0,
        };

        if (editingRecord) {
            executeUpdate({
                data: {
                    ...payload,
                    id: editingRecord.id,
                },
                onCompleted: (response) => {
                    if (response.result === true) {
                        showSuccessMessage('Cập nhật giáo trình thành công!');
                        handleCloseModal();
                        mixinFuncs.getList();
                    } else {
                        showErrorMessage('Cập nhật giáo trình thất bại!');
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
                    ordering: totalItems,
                },
                onCompleted: (response) => {
                    if (response.result === true) {
                        showSuccessMessage('Thêm mới giáo trình thành công!');
                        handleCloseModal();
                        mixinFuncs.getList();
                    } else {
                        showErrorMessage('Thêm mới giáo trình thất bại!');
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra!');
                },
            });
        }
    };

    mixinFuncs.renderActionBar = () => {
        return (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddModal}
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

    const columns = [
        sortColumn,
        {
            title: 'Avatar',
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
            title: 'Tên giáo trình',
            dataIndex: 'name',
            render: (name) => (
                <span>
                    <TextClamp lineClamp={2}>{name}</TextClamp>
                </span>
            ),
        },
        {
            title: 'Thời lượng',
            dataIndex: 'timeline',
            width: 150,
            align: 'right',
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 140, align: 'center' },
        ),
    ];

    const rowClassName = (record) => {
        return record.kind === 1 ? cx('table-row-phase') : '';
    };

    return (
        <PageWrapper className={cx('syllabus-drag-drop-page')} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, courseName)}>
            <div style={{ width: '50vw' }}>
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
                            rowClassName={rowClassName}
                            scroll={{ x: false }}
                        />
                    }
                />
            </div>
            <SyllabusModal
                open={isModalOpen}
                close={handleCloseModal}
                dataDetail={editingRecord}
                isEditing={!!editingRecord}
                onSubmit={handleSubmit}
                isSubmitting={loadingCreate || loadingUpdate}
                objectName={translate.formatMessage(pageOptions?.objectName || { id: 'syllabus', defaultMessage: 'Giáo trình' })}
                syllabusValue={syllabusValue}
                executeUpFile={executeUpFile}
            />
        </PageWrapper>
    );
};

export default SyllabusDragDropPage;