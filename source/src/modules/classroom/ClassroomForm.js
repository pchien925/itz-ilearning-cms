import apiConfig from '@constants/apiConfig';
import { classroomState,DEFAULT_FORMAT } from '@constants';
import { classroomStateOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { AutoCompleteField, BaseForm, DatePickerField, MoneyField, SelectField } from '@itz/react-cms-element';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';


const ClassroomForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const stateValue = translate.formatKeys(classroomStateOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing) {
            form.setFieldsValue({
                state: classroomState.PENDING,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            course: dataDetail?.course ? { id: dataDetail.course.id } : undefined,
            startDate: dataDetail.startDate ? dayjs(dataDetail.startDate, DEFAULT_FORMAT) : undefined,
            endDate: dataDetail.endDate ? dayjs(dataDetail.endDate, DEFAULT_FORMAT) : undefined,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <AutoCompleteField
                            name={['course', 'id']}
                            label={translate.formatMessage(commonMessage.course)}
                            allowClear={false}
                            apiConfig={apiConfig.course.autocomplete}
                            mappingOptions={(item) => {
                                return { label: item.name, value: item.id };
                            }}
                            required
                            useFetch={useFetch}
                        />
                    </Col>
                    <Col span={12}>
                        <MoneyField
                            name="price"
                            label={translate.formatMessage(commonMessage.price)}
                            min={0}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="startDate"
                            label={translate.formatMessage(commonMessage.startDate)}
                            format="DD/MM/YYYY HH:mm:ss"
                            showTime
                            style={{ width: '100%' }}
                            rules={[{ required: true }]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="endDate"
                            label={translate.formatMessage(commonMessage.endDate)}
                            format="DD/MM/YYYY HH:mm:ss"
                            showTime
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ClassroomForm;