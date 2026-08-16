import React from 'react';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import { showSuccessMessage, showErrorMessage } from '@itz/react-utils';
import { Button, Modal, Form, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import RatingForm from './RatingForm';

const message = defineMessages({
    modalTitleCreate: {
        id: 'module.rating.modal.title.create',
        defaultMessage: 'Thêm mới đánh giá',
    },
    modalTitleUpdate: {
        id: 'module.rating.modal.title.update',
        defaultMessage: 'Chỉnh sửa đánh giá',
    },
    cancelConfirmTitle: {
        id: 'module.rating.modal.cancelConfirm.title',
        defaultMessage: 'Xác nhận huỷ',
    },
    cancelConfirmContent: {
        id: 'module.rating.modal.cancelConfirm.content',
        defaultMessage: 'Bạn có chắc chắn muốn huỷ?',
    },
    cancelConfirmOk: {
        id: 'module.rating.modal.cancelConfirm.ok',
        defaultMessage: 'Đồng ý',
    },
    cancelConfirmCancel: {
        id: 'module.rating.modal.cancelConfirm.cancel',
        defaultMessage: 'Không',
    },
    btnCancel: {
        id: 'module.rating.modal.btnCancel',
        defaultMessage: 'Hủy',
    },
    btnUpdate: {
        id: 'module.rating.modal.btnUpdate',
        defaultMessage: 'Cập nhật',
    },
    btnCreate: {
        id: 'module.rating.modal.btnCreate',
        defaultMessage: 'Thêm mới',
    },
    updateSuccess: {
        id: 'module.rating.modal.updateSuccess',
        defaultMessage: 'Cập nhật đánh giá thành công!',
    },
    updateFailed: {
        id: 'module.rating.modal.updateFailed',
        defaultMessage: 'Cập nhật đánh giá thất bại!',
    },
    createSuccess: {
        id: 'module.rating.modal.createSuccess',
        defaultMessage: 'Thêm đánh giá thành công!',
    },
    createFailed: {
        id: 'module.rating.modal.createFailed',
        defaultMessage: 'Thêm đánh giá thất bại!',
    },
    commonError: {
        id: 'module.rating.modal.commonError',
        defaultMessage: 'Đã có lỗi xảy ra!',
    },
});

const RatingModal = ({ open, onCancel, editingRecord, onSuccess, translate, commonMessage }) => {
    const [form] = Form.useForm();
    const [isFormTouched, setIsFormTouched] = useState(false);
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.rating.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.rating.update);

    useEffect(() => {
        if (!open) return;

        setIsFormTouched(false);

        if (editingRecord) {
            form.setFieldsValue({
                student: {
                    label: editingRecord.student?.account?.fullName,
                    value: editingRecord.student?.id,
                    item: editingRecord.student,
                },
                course: {
                    label: editingRecord.course?.name,
                    value: editingRecord.course?.id,
                    item: editingRecord.course,
                },
                star: editingRecord.star,
                ratingContent: editingRecord.message,
            });
        } else {
            form.resetFields();
        }
    }, [open, editingRecord]);

    const handleClose = () => {
        form.resetFields();
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

    const onFinishRating = (values) => {
        if (editingRecord) {
            executeUpdate({
                data: {
                    id: editingRecord.id,
                    star: values.star,
                    message: values.ratingContent,
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
                    studentId: values.student,
                    courseId: values.course,
                    star: values.star,
                    message: values.ratingContent,
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
            title={
                editingRecord
                    ? translate.formatMessage(message.modalTitleUpdate)
                    : translate.formatMessage(message.modalTitleCreate)
            }
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
                onFinish={onFinishRating}
                onValuesChange={() => setIsFormTouched(true)}
            >
                <RatingForm
                    form={form}
                    translate={translate}
                    commonMessage={commonMessage}
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

export default RatingModal;