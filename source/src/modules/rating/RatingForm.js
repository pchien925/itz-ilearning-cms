import { TextField, AutoCompleteField } from '@itz/react-cms-element';
import StarRatingInput from '@components/StarRating/StarRatingInput';
import apiConfig from '@constants/apiConfig';
import { Form, Row, Col } from 'antd';
import React from 'react';
import useFetch from '@hooks/useFetch';

const RatingForm = ({ form, translate, commonMessage, editingRecord  }) => {
    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <AutoCompleteField
                        name="student"
                        label={translate.formatMessage(commonMessage.student)}
                        placeholder={translate.formatMessage(commonMessage.student)}
                        allowClear={false}
                        disabled={!!editingRecord}
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
                        disabled={!!editingRecord}
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
        </>
    );
};

export default RatingForm;