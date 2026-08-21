import React, { useState } from 'react';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row } from 'antd';
import useBasicForm from '@hooks/useBasicForm';
import { BaseForm, AutoCompleteField } from '@itz/react-cms-element';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

const ClassroomStudentForm = (props) => {
    const { formId, onSubmit, onCancel, isSubmitting, translate, commonMessage } = props;
    const [isChangedFormValues, setIsChangedFormValues] = useState(false);
    

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
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
            <Row gutter={16}>
                <Col span={24}>
                    <AutoCompleteField
                        name="studentId"
                        label={translate.formatMessage(commonMessage.student)}
                        placeholder={translate.formatMessage(commonMessage.student)}
                        apiConfig={apiConfig.student.autocomplete}
                        mappingOptions={(item) => ({
                            label: item.account?.fullName,
                            value: item.id,
                        })}
                        searchParams={(text) => ({ fullName: text })}
                        required
                        useFetch={useFetch}
                    />
                </Col>
            </Row>

            <div className="footer-card-form" style={{ marginTop: 24 }}>
                <Row justify="end" gutter={12}>
                    <Col>
                        <Button
                            danger
                            key="cancel"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isChangedFormValues) {
                                    Modal.confirm({
                                        title: translate.formatMessage(commonMessage.confirmCancel || { id: 'confirmCancel', defaultMessage: 'Xác nhận hủy' }),
                                        content: translate.formatMessage(commonMessage.confirmCancelContent || { id: 'confirmCancelContent', defaultMessage: 'Bạn có chắc chắn muốn hủy?' }),
                                        cancelButtonProps: { danger: true },
                                        onOk: () => {
                                            setIsChangedFormValues(false);
                                            onCancel();
                                        },
                                        okText: translate.formatMessage(commonMessage.yes || { id: 'yes', defaultMessage: 'Đồng ý' }),
                                        cancelText: translate.formatMessage(commonMessage.no || { id: 'no', defaultMessage: 'Không' }),
                                    });
                                } else {
                                    onCancel();
                                }
                            }}
                            icon={<StopOutlined />}
                        >
                            {translate.formatMessage(commonMessage.cancel || { id: 'cancel', defaultMessage: 'Hủy' })}
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
                            {translate.formatMessage({ id: 'create', defaultMessage: 'Thêm mới' })}
                        </Button>
                    </Col>
                </Row>
            </div>
        </BaseForm>
    );
};

export default ClassroomStudentForm;