import React from 'react';
import { Row, Col, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CropImageField, TextField, SelectField } from '@itz/react-cms-element';
import { AppConstants } from '@constants';
import { commonMessage } from '@locales/intl';
import { sliderTypeActionOptions } from '@constants/masterData';
import styles from './PageConfigFormItem.module.scss';

const PageConfigFormItem = ({
    index,
    slider,
    handleRemoveSlider,
    uploadFile,
    translate,
    currentImageUrl,
}) => {
    return (
        <div className={styles.wrapper}>

            <div className={styles.actionBar}>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveSlider(index)}
                    disabled={slider.length === 1}
                />
            </div>

            <div className={styles.content}>
                <Row gutter={16}>
                    <Col span={24}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.sliderImage)}
                            name={['slider', index, 'image']}
                            imageUrl={currentImageUrl ? `${AppConstants.avatarRootUrl}${currentImageUrl}` : null}
                            aspect={16 / 9}
                            uploadFile={(file, onSuccess, onError) => uploadFile(file, onSuccess, onError, index)}
                        />
                    </Col>

                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.title)}
                            name={['slider', index, 'title']}
                        />
                    </Col>

                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.description)}
                            name={['slider', index, 'description']}
                            type="textarea"
                            autoSize={{ minRows: 6, maxRows: 10 }}
                        />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            label={translate.formatMessage(commonMessage.sliderTypeAction)}
                            name={['slider', index, 'typeAction']}
                            options={sliderTypeActionOptions}
                            disabled={true}
                            initialValue={1}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.sliderUrl)}
                            name={['slider', index, 'url']}
                        />
                    </Col>
                </Row>
            </div>

        </div>
    );
};

export default PageConfigFormItem;