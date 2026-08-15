import React from 'react';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { showSuccessMessage, showErrorMessage } from '@itz/react-utils';
import { Button, Modal, Form, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import SyllabusForm from './SyllabusForm';

const message = defineMessages({
    modalTitle: {
        id: 'module.syllabus.modal.title',
        defaultMessage: 'Thêm mới giáo trình',
    },
    cancelConfirmTitle: {
        id: 'module.syllabus.modal.cancelConfirm.title',
        defaultMessage: 'Xác nhận huỷ',
    },
    cancelConfirmContent: {
        id: 'module.syllabus.modal.cancelConfirm.content',
        defaultMessage: 'Bạn có chắc chắn muốn huỷ?',
    },
    cancelConfirmOk: {
        id: 'module.syllabus.modal.cancelConfirm.ok',
        defaultMessage: 'Đồng ý',
    },
    cancelConfirmCancel: {
        id: 'module.syllabus.modal.cancelConfirm.cancel',
        defaultMessage: 'Không',
    },
    btnCancel: {
        id: 'module.syllabus.modal.btnCancel',
        defaultMessage: 'Hủy',
    },
    btnUpdate: {
        id: 'module.syllabus.modal.btnUpdate',
        defaultMessage: 'Cập nhật',
    },
    btnCreate: {
        id: 'module.syllabus.modal.btnCreate',
        defaultMessage: 'Thêm mới',
    },
    uploadSuccess: {
        id: 'module.syllabus.modal.uploadSuccess',
        defaultMessage: 'Upload file thành công !',
    },
    uploadInvalid: {
        id: 'module.syllabus.modal.uploadInvalid',
        defaultMessage: 'File upload không hợp lệ !',
    },
    updateSuccess: {
        id: 'module.syllabus.modal.updateSuccess',
        defaultMessage: 'Cập nhật giáo trình thành công!',
    },
    updateFailed: {
        id: 'module.syllabus.modal.updateFailed',
        defaultMessage: 'Cập nhật giáo trình thất bại!',
    },
    createSuccess: {
        id: 'module.syllabus.modal.createSuccess',
        defaultMessage: 'Thêm giáo trình thành công!',
    },
    createFailed: {
        id: 'module.syllabus.modal.createFailed',
        defaultMessage: 'Thêm giáo trình thất bại!',
    },
    commonError: {
        id: 'module.syllabus.modal.commonError',
        defaultMessage: 'Đã có lỗi xảy ra!',
    },
});

const SyllabusModal = ({
    open,
    onCancel,
    editingRecord,
    courseId,
    sortedData,
    onSuccess,
    translate,
    commonMessage,
    syllabusValue,
}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [isFormTouched, setIsFormTouched] = useState(false);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.syllabus.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.syllabus.update);

    useEffect(() => {
        if (!open) return;

        setIsFormTouched(false);

        if (editingRecord) {
            setImageUrl(editingRecord.avatar || null);
            form.setFieldsValue({
                name: editingRecord.name,
                kind: editingRecord.kind,
                timeline: editingRecord.timeline,
                description: editingRecord.description,
                avatar: editingRecord.avatar,
            });
        } else {
            form.resetFields();
            setImageUrl(null);
        }
    }, [open, editingRecord]);

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
                    setIsFormTouched(true);
                    showSuccessMessage(translate.formatMessage(message.uploadSuccess));
                }
            },
            onError: (error) => {
                if (error.code === 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage(translate.formatMessage(message.uploadInvalid));
                }
            },
        });
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

    const handleClose = () => {
        form.resetFields();
        setImageUrl(null);
        setIsFormTouched(false);
        onCancel();
    };

    const handleCancel = () => {
        if (isFormTouched) {
            Modal.confirm({
                title: translate.formatMessage(message.cancelConfirmTitle),
                content: translate.formatMessage(message.cancelConfirmContent),
                okText: translate.formatMessage(message.cancelConfirmOk),
                cancelText: translate.formatMessage(message.cancelConfirmCancel),
                centered: true,
                cancelButtonProps: { danger: true },
                style: { top: '-30%' },
                onOk: handleClose,
            });
        } else {
            handleClose();
        }
    };

    const onFinishSyllabus = (values) => {
        const totalItems = sortedData?.length || 0;
        let chapterId = 0;

        if (values.kind === 2 && editingRecord) {
            chapterId = getNearestChapterId(sortedData, editingRecord.id);
        }

        const payload = {
            ...values,
            avatar: imageUrl,
            courseId,
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
                        showSuccessMessage(translate.formatMessage(message.updateSuccess));
                        handleClose();
                        onSuccess();
                    } else {
                        showErrorMessage(translate.formatMessage(message.updateFailed));
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || translate.formatMessage(message.commonError));
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
                        showSuccessMessage(translate.formatMessage(message.createSuccess));
                        handleClose();
                        onSuccess();
                    } else {
                        showErrorMessage(translate.formatMessage(message.createFailed));
                    }
                },
                onError: (error) => {
                    showErrorMessage(error?.message || translate.formatMessage(message.commonError));
                },
            });
        }
    };

    return (
        <Modal
            title={translate.formatMessage(message.modalTitle)}
            open={open}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            centered
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ kind: 1, timeline: 0 }}
                onFinish={onFinishSyllabus}
                onValuesChange={() => setIsFormTouched(true)}
            >
                <SyllabusForm
                    form={form}
                    translate={translate}
                    commonMessage={commonMessage}
                    syllabusValue={syllabusValue}
                    imageUrl={imageUrl}
                    uploadFile={uploadFile}
                    editingRecord={editingRecord}
                />
                <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
                    <Col>
                        <Button danger onClick={handleCancel} icon={<StopOutlined />}>
                            {translate.formatMessage(message.btnCancel)}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={editingRecord ? loadingUpdate : loadingCreate}
                            icon={<SaveOutlined />}
                            disabled={!isFormTouched}
                        >
                            {editingRecord ? translate.formatMessage(message.btnUpdate) : translate.formatMessage(message.btnCreate)}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default SyllabusModal;