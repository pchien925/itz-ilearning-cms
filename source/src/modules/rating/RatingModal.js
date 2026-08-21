import React from 'react';
import { Modal } from 'antd';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import RatingForm from './RatingForm';

const RatingModal = ({
    open,
    close,
    dataDetail,
    isEditing,
    onSubmit,
    isSubmitting,
    objectName,
}) => {
    const translate = useTranslate();

    return (
        <Modal
            title={translate.formatMessage(isEditing ? commonMessage.editObject : commonMessage.addNewObject, {
                objectName,
            })}
            open={open}
            onCancel={close}
            footer={null}
            destroyOnClose
            centered
            maskClosable={false}
            width={800}
        >
            <RatingForm
                formId="modal-rating-form"
                dataDetail={dataDetail}
                isEditing={isEditing}
                onSubmit={onSubmit}
                onCancel={close}
                isSubmitting={isSubmitting}
                translate={translate}
                commonMessage={commonMessage}
            />
        </Modal>
    );
};

export default RatingModal;