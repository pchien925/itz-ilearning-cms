import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Modal } from 'antd';
import React from 'react';
import TagForm from './TagForm';

const TagModal = ({ 
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
            open={open}
            onCancel={close}
            title={translate.formatMessage(isEditing ? commonMessage.editObject : commonMessage.addNewObject, {
                objectName,
            })}
            footer={null}
            destroyOnClose
            maskClosable={false}
            // width={800}
            centered
        >
            <TagForm
                formId="modal-tag-form"
                dataDetail={dataDetail}
                isEditing={isEditing}
                onSubmit={onSubmit}
                onCancel={close}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
};

export default TagModal;