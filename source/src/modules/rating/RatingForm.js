import React, { useEffect, useState } from 'react';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row } from 'antd';
import useBasicForm from '@hooks/useBasicForm';
import { BaseForm, TextField, AutoCompleteField } from '@itz/react-cms-element';
import StarRatingInput from '@components/StarRating/StarRatingInput';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';

const RatingForm = (props) => {
    const {
        formId,
        dataDetail,
        onSubmit,
        onCancel,
        isEditing,
        isSubmitting,
        translate,
        commonMessage,
    } = props;

    const [isChangedFormValues, setIsChangedFormValues] = useState(false);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (dataDetail) {
            form.setFieldsValue({
                student: dataDetail.student ? {
                    label: dataDetail.student?.account?.fullName,
                    value: dataDetail.student?.id,
                    item: dataDetail.student,
                } : undefined,
                course: dataDetail.course ? {
                    label: dataDetail.course?.name,
                    value: dataDetail.course?.id,
                    item: dataDetail.course,
                } : undefined,
                star: dataDetail.star,
                ratingContent: dataDetail.message,
            });
        } else {
            form.resetFields();
        }
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
                <Col span={12}>
                    <AutoCompleteField
                        name="student"
                        label={translate.formatMessage(commonMessage.student)}
                        placeholder={translate.formatMessage(commonMessage.student)}
                        allowClear={false}
                        disabled={isEditing}
                        apiConfig={apiConfig.student.autocomplete}
                        mappingOptions={(item) => ({
                            label: item.account?.fullName,
                            value: item.id,
                            item,
                        })}
                        required
                        useFetch={useFetch}
                    />
                </Col>
                <Col span={12}>
                    <Form.Item
                        label={translate.formatMessage(commonMessage.star)}
                        name="star"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <StarRatingInput max={5} />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <AutoCompleteField
                        name="course"
                        label={translate.formatMessage(commonMessage.course)}
                        placeholder={translate.formatMessage(commonMessage.course)}
                        allowClear={false}
                        disabled={isEditing}
                        apiConfig={apiConfig.course.autocomplete}
                        mappingOptions={(item) => ({
                            label: item.name,
                            value: item.id,
                            item,
                        })}
                        required
                        useFetch={useFetch}
                    />
                </Col>
                <Col span={24}>
                    <TextField
                        label={translate.formatMessage(commonMessage.ratingContent)}
                        placeholder={translate.formatMessage(commonMessage.ratingContent)}
                        name="ratingContent"
                        type="textarea"
                        autoSize={{ minRows: 6, maxRows: 10 }}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
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

export default RatingForm;