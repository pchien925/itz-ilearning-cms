import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, MenuOutlined, UserOutlined, StopOutlined } from '@ant-design/icons';
import DefaultAvatar from '@assets/images/avatar-default.png';
import { PageWrapper, ListPage, BaseTooltip, AvatarField, TextClamp, TextField, CropImageField, SelectField, DragDropTableV2 } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import { syllabusKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Space, Modal, Form, Row, Col } from 'antd';
import React, { useState } from 'react';
import { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import useDragDrop from '@hooks/useDragDrop';
import useFetch from '@hooks/useFetch';
import { showSuccessMessage, showErrorMessage } from '@itz/react-utils';

const SyllabusDragDropPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [courseName] = useState(searchParams.get('courseName') || 'Giáo trình');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.syllabus.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.syllabus.update);
    const { execute: executeDelete } = useFetch(apiConfig.syllabus.delete);
    const syllabusValue = translate.formatKeys(syllabusKindOptions, ['label']);
    const kindValue = Form.useWatch('kind', form);
    const syllabusNameValue = Form.useWatch('name', form);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
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
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    ...params,
                    courseId: id,
                });
            };
        },
    });

    const {
        sortedData,
        isOrderingChanged,
        handleUpdate,
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

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    form.setFieldsValue({ avatar: response.data.filePath });
                    showSuccessMessage('Upload file thành công !');
                }
            },
            onError: (error) => {
                if (error.code === 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage('File upload không hợp lệ !');
                }
            },
        });
    };

    const openAddModal = () => {
        setEditingRecord(null);
        form.resetFields();
        setImageUrl(null);
        setIsAddModalVisible(true);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setImageUrl(record.avatar || null);
        form.setFieldsValue({
            name: record.name,
            kind: record.kind,
            timeline: record.timeline,
            description: record.description,
            avatar: record.avatar,
        });
        setIsAddModalVisible(true);
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

    const onFinishSyllabus = (values) => {
        const totalItems = pagination?.total || data?.length || 0;
        let chapterId = 0;

        if (values.kind === 2 && editingRecord) {
            chapterId = getNearestChapterId(sortedData, editingRecord.id);
        }

        const payload = {
            ...values,
            avatar: imageUrl,
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
                        closeModal();
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
                        showSuccessMessage('Thêm giáo trình thành công!');
                        closeModal();
                        mixinFuncs.getList();
                    } else {
                        showErrorMessage('Thêm giáo trình thất bại!');
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra!');
                },
            });
        }
    };

    const handleDelete = (record) => {
        const chapterId = record.kind === 2 ? getNearestChapterId(sortedData, record.id) : 0;

        Modal.confirm({
            title: 'Xác nhận xoá',
            content: `Bạn có chắc chắn muốn xoá "${record.name}"?`,
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: () => {
                executeDelete({
                    pathParams: { id: record.id },
                    params: { chapterId },
                    onCompleted: (response) => {
                        if (response.result === true) {
                            showSuccessMessage('Xoá giáo trình thành công!');
                            mixinFuncs.getList();
                        } else {
                            showErrorMessage(response?.message || 'Xoá giáo trình thất bại!');
                        }
                    },
                    onError: (error) => {
                        showErrorMessage(error?.message || 'Đã có lỗi xảy ra!');
                    },
                });
            },
        });
    };


    const closeModal = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        setImageUrl(null);
        setEditingRecord(null);
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
                    disabled={!isOrderingChanged}
                    onClick={() => handleUpdate(sortedData, false)}
                >
                    Cập nhật vị trí
                </Button>
            </div>
        );
    };

    const columns = [
        {
            title: '',
            key: 'sort',
            width: 50,
            align: 'center',
            render: () => <MenuOutlined style={{ cursor: 'move', color: '#505050' }} />,
        },
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
            render: (name, record) => {
                const isChapter = record.kind === 1;
                return (
                    <span>
                        <TextClamp lineClamp={2}>{name}</TextClamp>
                    </span>
                );
            },
        },
        {
            title: 'Thời lượng',
            dataIndex: 'timeline',
            width: 150,
            align: 'right',
        },
        {
            title: 'Hành động',
            width: 140,
            align: 'center',
            render: (text, record) => {
                const hasEditPerm = mixinFuncs.hasPermission([apiConfig.syllabus.update.permissionCode]);
                const hasDeletePerm = mixinFuncs.hasPermission([apiConfig.syllabus.delete.permissionCode]);
                const objectNameStr = translate.formatMessage(pageOptions?.objectName || { id: 'syllabus', defaultMessage: 'Giáo trình' });

                return (
                    <Space size="middle">
                        <BaseTooltip type="edit" objectName={objectNameStr}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(record);
                                }}
                                disabled={!hasEditPerm}
                                style={{ padding: 0 }}
                            >
                                <EditOutlined style={{ color: !hasEditPerm ? '' : '#1890ff' }} />
                            </Button>
                        </BaseTooltip>

                        <BaseTooltip type="delete" objectName={objectNameStr}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(record);
                                }}
                                disabled={!hasDeletePerm}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: !hasDeletePerm ? '' : 'red' }} />
                            </Button>
                        </BaseTooltip>
                    </Space>
                );
            },
        },
    ];

    const rowClassName = (record) => {
        return record.kind === 1 ? 'table-row-phase' : '';
    };

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate, courseName)}>
            <style>{`
                .table-row-phase {
                    background-color: #adadad !important;
                }
                .ant-table-tbody > tr:active {
                    cursor: grabbing;
                }
            `}</style>
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
            <Modal
                title="Thêm mới giáo trình"
                open={isAddModalVisible}
                onCancel={closeModal}
                footer={null}
                destroyOnClose
                centered
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishSyllabus}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <CropImageField
                                label={translate.formatMessage(commonMessage.avatar)}
                                name="avatar"
                                imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : DefaultAvatar}
                                aspect={1 / 1}
                                uploadFile={uploadFile}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <TextField
                                label={translate.formatMessage(commonMessage.syllabusName)}
                                placeholder={translate.formatMessage(commonMessage.syllabusName)}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <SelectField
                                name='kind'
                                label={translate.formatMessage(commonMessage.kind)}
                                placeholder={translate.formatMessage(commonMessage.kind)}
                                allowClear={false}
                                options={syllabusValue}
                                initialValue={1}
                                disabled={editingRecord}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </Col>
                        {kindValue === 2 && (
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.timeline)}
                                    placeholder={translate.formatMessage(commonMessage.timeline)}
                                    name="timeline"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                />
                            </Col>
                        )}
                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.description)}
                                placeholder={translate.formatMessage(commonMessage.description)}
                                name="description"
                                type="textarea"
                                autoSize={{ minRows: 6, maxRows: 10 }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
                        <Col>
                            <Button danger onClick={closeModal} icon={<StopOutlined />}>
                                Hủy
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={editingRecord ? loadingUpdate : loadingCreate}
                                icon={<SaveOutlined />}
                                disabled={!syllabusNameValue}
                            >
                                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </PageWrapper>
    );
};

export default SyllabusDragDropPage;