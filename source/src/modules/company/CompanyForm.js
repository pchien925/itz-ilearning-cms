import DefaultAvatar from '@assets/images/avatar-default.png';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { AutoCompleteField, BaseForm, CropImageField, PasswordField, SelectField, TextField } from '@itz/react-cms-element';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { checkEmail, checkFullName, checkPassword, checkPhone, checkUserName } from '@itz/react-utils';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const CompanyForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, kind } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const statusValue = translate.formatKeys(statusOptions, ['label']);

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
                    form.setFieldsValue({ avatar: response.data.filePath });
                    setIsChangedFormValues(true);
                    showSuccessMessage('Upload file thành công !');
                }
            },
            onError: (error) => {
                if (error.code == 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage('File upload không hợp lệ !');
                }
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatarPath: imageUrl });
    };

    useEffect(() => {
        if (!isEditing) {
            form.setFieldsValue({
                status: STATUS_ACTIVE,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatar);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatar"
                            imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : DefaultAvatar}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.companyName)}
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
                            name='status'
                            label="Trạng thái"
                            allowClear={false}
                            disabled={!isEditing}
                            options={statusValue}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
};

export default CompanyForm;