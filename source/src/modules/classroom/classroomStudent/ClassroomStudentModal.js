import React from 'react';
import { Modal } from 'antd';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import ClassroomStudentForm from './ClassroomStudentForm';

const ClassroomStudentModal = ({
    open,
    close,
    onSubmit,
    isSubmitting,
}) => {
    const translate = useTranslate();

    return (
        <Modal
            title="Thêm học viên"
            open={open}
            onCancel={close}
            footer={null}
            destroyOnClose
            centered
            maskClosable={false}
            width={600}
        >
            <ClassroomStudentForm
                formId="modal-classroom-student-form"
                onSubmit={onSubmit}
                onCancel={close}
                isSubmitting={isSubmitting}
                translate={translate}
                commonMessage={commonMessage}
            />
        </Modal>
    );
};

export default ClassroomStudentModal;