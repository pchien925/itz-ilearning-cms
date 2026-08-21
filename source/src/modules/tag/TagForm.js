import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { AppConstants } from '@constants';
import DefaultAvatar from '@assets/images/avatar-default.png';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { BaseForm, ColorPickerField, SelectField, TextField } from '@itz/react-cms-element';
import { commonMessage } from '@locales/intl';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const TagForm = (props) => {
    const {
        formId,
        dataDetail,
        onSubmit,
        onCancel,
        isEditing,
        isSubmitting,
    } = props;

    const [isChangedFormValues, setIsChangedFormValues] = useState(false);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail, form]);

    return (
        <BaseForm
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            style={{ width: '100%' }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <TextField
                        label={translate.formatMessage(commonMessage.tagName)}
                        name="name"
                        required
                        placeholder={translate.formatMessage(commonMessage.tagName)}
                        maxLength={100}
                    />
                </Col>
                <Col span={24}>
                    <ColorPickerField
                        label={translate.formatMessage(commonMessage.colorCode)}
                        name="colorCode"
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

export default TagForm;