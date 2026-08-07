import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { CropImageField, TextField } from '@itz/react-cms-element';
import { commonMessage } from '@locales/intl';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordLengthError: 'Password must be at least 6 characters',
    passwordMatchError: 'Password does not match',
});

const ProfileForm = (props) => {
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions } = props;
    const [imageUrl, setImageUrl] = useState(null);

    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const translate = useTranslate();

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

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
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail?.avatarPath);
    }, [dataDetail]);

    const handleFinish = (values) => {
        mixinFuncs.handleSubmit({
            ...values,
            avatarPath: imageUrl,
        });
    };

    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '80%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatarPath"
                            imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                            aspect={1 / 1}
                            required
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>

                <TextField
                    readOnly
                    label={translate.formatMessage(commonMessage.username)}
                    name='username'
                />
                <TextField label={translate.formatMessage(commonMessage.email)} name='email' />
                <TextField label={translate.formatMessage(commonMessage.fullName)} name='fullName' />
                <TextField label={translate.formatMessage(commonMessage.phone)} name='phone' />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.currentPassword)}
                    required
                    name="oldPassword"
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.newPassword)}
                    name="password"
                    rules={[
                        {
                            validator: async () => {
                                const isTouched = form.isFieldTouched('newPassword');
                                if (isTouched) {
                                    const value = form.getFieldValue('newPassword');
                                    if (value.length < 6) {
                                        throw new Error(translate.formatMessage(messages.passwordLengthError));
                                    }
                                }
                            },
                        },
                    ]}
                />
                <TextField
                    type="password"
                    label={translate.formatMessage(messages.confirmPassword)}
                    rules={[
                        {
                            validator: async () => {
                                const password = form.getFieldValue('newPassword');
                                const confirmPassword = form.getFieldValue('confirmPassword');
                                if (password !== confirmPassword) {
                                    throw new Error(translate.formatMessage(messages.passwordMatchError));
                                }
                            },
                        },
                    ]}
                />

                <div className="footer-card-form">{actions}</div>
            </Form>
        </Card>
    );
};

export default ProfileForm;
