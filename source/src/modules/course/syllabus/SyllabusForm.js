import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { AppConstants } from '@constants';
import DefaultAvatar from '@assets/images/avatar-default.png';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { BaseForm, CropImageField, SelectField, TextField } from '@itz/react-cms-element';
import { commonMessage } from '@locales/intl';
import { Button, Col, Modal, Row, Form } from 'antd';
import React, { useEffect, useState } from 'react';

const SyllabusForm = (props) => {
    const { 
        formId, 
        dataDetail, 
        onSubmit, 
        onCancel, 
        isEditing, 
        isSubmitting, 
        syllabusValue, 
        executeUpFile,
    } = props;
    
    const [isChangedFormValues, setIsChangedFormValues] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const watchedKind = Form.useWatch('kind', form);
    const kindValue = isEditing ? 2 : watchedKind;

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatar: imageUrl });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            kind: dataDetail?.kind ?? 1,
            timeline: dataDetail?.timeline ?? 0,
        });
        setImageUrl(dataDetail?.avatar || null);
    }, [dataDetail, form]);

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: { type: 'AVATAR', file: file },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    form.setFieldsValue({ avatar: response.data.filePath });
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError(error);
            },
        });
    };

    return (
        <BaseForm
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            style={{ width: '100%' }}
        >
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <CropImageField
                        label={translate.formatMessage(commonMessage.avatar)}
                        name="avatar"
                        imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : DefaultAvatar}
                        aspect={1 / 1}
                        uploadFile={uploadFile}
                        rules={[{ required: true }]}
                    />
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                        label={translate.formatMessage(commonMessage.syllabusName)}
                        name="name"
                        required
                        placeholder={translate.formatMessage(commonMessage.syllabusName)}
                    />
                </Col>
                <Col span={12}>
                    <SelectField
                        name="kind"
                        label={translate.formatMessage(commonMessage.kind)}
                        placeholder={translate.formatMessage(commonMessage.kind)}
                        allowClear={false}
                        options={syllabusValue}
                        disabled={isEditing}
                        rules={[{ required: true }]}
                    />
                </Col>
                {kindValue === 2 && (
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.timeline)}
                            placeholder={translate.formatMessage(commonMessage.timeline)}
                            name="timeline"
                            disabled={watchedKind === 1}
                            rules={[{ required: true }]}
                        />
                    </Col>
                )}
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <TextField
                        label={translate.formatMessage(commonMessage.description)}
                        placeholder={translate.formatMessage(commonMessage.description)}
                        name="description"
                        type="textarea"
                        autoSize={{ minRows: 6, maxRows: 10 }}
                        rules={[{ required: true }]}
                    />
                </Col>
            </Row>

            <div className="footer-card-form">
                <Row justify="end" gutter={12}>
                    <Col>
                        <Button
                            danger
                            key="cancel"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isChangedFormValues) {
                                    Modal.confirm({
                                        title: translate.formatMessage(commonMessage.confirmCancel),
                                        content: translate.formatMessage(commonMessage.confirmCancelContent),
                                        cancelButtonProps: { danger: true },
                                        onOk: () => {
                                            setIsChangedFormValues(false);
                                            onCancel();
                                        },
                                        okText: translate.formatMessage(commonMessage.yes),
                                        cancelText: translate.formatMessage(commonMessage.no),
                                    });
                                } else {
                                    onCancel();
                                }
                            }}
                            icon={<StopOutlined />}
                        >
                            {translate.formatMessage(commonMessage.cancel)}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            key="submit"
                            htmlType="submit"
                            type="primary"
                            loading={isSubmitting}
                            disabled={!isChangedFormValues}
                            icon={<SaveOutlined />}
                        >
                            {isEditing
                                ? translate.formatMessage(commonMessage.update)
                                : translate.formatMessage(commonMessage.addNew)}
                        </Button>
                    </Col>
                </Row>
            </div>
        </BaseForm>
    );
};

export default SyllabusForm;