import React from 'react';
import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { SaveOutlined } from '@ant-design/icons';
import { showErrorMessage, showSuccessMessage } from '@itz/react-utils';
import PageConfigForm from './PageConfigForm';
import { Button, Col, Row } from 'antd';
import { defineMessages } from 'react-intl';

const PageConfigSavePage = ({ tabData }) => {
    const message = defineMessages({
        update: 'Cập nhật',
    });
    const translate = useTranslate();
    const settingRecord = tabData && tabData.length > 0 ? tabData[0] : {};
    const settingId = settingRecord?.id;

    const { mixinFuncs, onSave, setIsChangedFormValues, setSubmit } = useSaveBase({
        apiConfig: {
            getById: apiConfig.setting.getById,
            create: apiConfig.setting.create,
            update: apiConfig.setting.update,
        },
        options: {
            objectName: settingRecord?.keyName || 'Cấu hình',
            id: settingId,
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (formData) => {
                return {
                    ...settingRecord,
                    ...formData,
                    id: settingId,
                };
            };

            funcs.renderActions = () => (
                <Row justify="end" gutter={12}>
                    <Col>
                        <Button
                            htmlType="submit"
                            type="primary"
                            form={funcs.getFormId()}
                            icon={<SaveOutlined />}
                        >
                            {translate.formatMessage(message.update)}
                        </Button>
                    </Col>
                </Row>
            );

            funcs.onUpdateCompleted = (responseData) => {
                if (responseData.result === true) {
                    showSuccessMessage('Cập nhật Cài đặt thành công');
                    setSubmit(false);
                }
            };

            funcs.onSaveError = (err) => {
                const errorInfo = errorCode?.[err?.code];
                if (errorInfo) {
                    showErrorMessage(translate.formatMessage(errorInfo.message));
                } else {
                    showErrorMessage(err?.message || 'Có lỗi xảy ra khi lưu cấu hình!');
                }
                setSubmit(false);
            };
        },
    });

    return (
        <PageConfigForm
            setIsChangedFormValues={setIsChangedFormValues}
            dataDetail={settingRecord}
            formId={mixinFuncs.getFormId()}
            actions={mixinFuncs.renderActions()}
            onSubmit={onSave}
        />
    );
};

export default PageConfigSavePage;