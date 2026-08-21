import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Modal } from 'antd';
import React from 'react';
import SyllabusForm from './SyllabusForm';

const SyllabusModal = ({ 
    open, 
    close, 
    dataDetail, 
    isEditing, 
    onSubmit, 
    isSubmitting, 
    objectName, 
    syllabusValue, 
    executeUpFile,
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
            width={800}
            centered
        >
            <SyllabusForm
                formId="modal-syllabus-form"
                dataDetail={dataDetail}
                isEditing={isEditing}
                onSubmit={onSubmit}
                onCancel={close}
                isSubmitting={isSubmitting}
                syllabusValue={syllabusValue}
                executeUpFile={executeUpFile}
            />
        </Modal>
    );
};

export default SyllabusModal;