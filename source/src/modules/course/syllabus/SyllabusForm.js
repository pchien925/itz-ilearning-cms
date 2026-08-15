import { CropImageField, TextField, SelectField } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import DefaultAvatar from '@assets/images/avatar-default.png';
import { Form, Row, Col } from 'antd';
import React from 'react';

const SyllabusForm = ({ form, translate, commonMessage, syllabusValue, imageUrl, uploadFile, editingRecord }) => {
    const watchedKind = Form.useWatch('kind', form);
    const kindValue = editingRecord ? 2 : watchedKind;

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <CropImageField
                        label={translate.formatMessage(commonMessage.avatar)}
                        name="avatar"
                        imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : DefaultAvatar}
                        aspect={1 / 1}
                        uploadFile={uploadFile}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <TextField
                        label={translate.formatMessage(commonMessage.syllabusName)}
                        placeholder={translate.formatMessage(commonMessage.syllabusName)}
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
                        name="kind"
                        label={translate.formatMessage(commonMessage.kind)}
                        placeholder={translate.formatMessage(commonMessage.kind)}
                        allowClear={false}
                        options={syllabusValue}
                        initialValue={1}
                        disabled={editingRecord}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    />
                </Col>
                {kindValue === 2 && (
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.timeline)}
                            placeholder={translate.formatMessage(commonMessage.timeline)}
                            name="timeline"
                            disabled={watchedKind === 1}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    </Col>
                )}
                <Col span={24}>
                    <TextField
                        label={translate.formatMessage(commonMessage.description)}
                        placeholder={translate.formatMessage(commonMessage.description)}
                        name="description"
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

export default SyllabusForm;