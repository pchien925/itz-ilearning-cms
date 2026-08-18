import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { BaseForm, TextField } from '@itz/react-cms-element';
import { Card, Col, Row, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { showSuccessMessage, showErrorMessage } from '@itz/react-utils';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import PageConfigFormItem from './PageConfigFormItem';
import SliderPagination from './SliderPagination';
import styles from './PageConfigForm.module.scss';
import { commonMessage } from '@locales/intl';
import { defineMessages } from 'react-intl';

const PageConfigForm = (props) => {

    const message = defineMessages({

        uploadSuccess: {
            id: 'module.syllabus.modal.uploadSuccess',
            defaultMessage: 'Upload file thành công !',
        },
        uploadInvalid: {
            id: 'module.syllabus.modal.uploadInvalid',
            defaultMessage: 'File upload không hợp lệ !',
        },
        deleteConfirmTitle: {
            id: 'module.base.deleteConfirm.title',
            defaultMessage: 'Xác nhận xoá slide',
        },
        deleteConfirmcontent: {
            id: 'module.base.deleteConfirm.content',
            defaultMessage: 'Bạn có chắc chắn muốn xóa slide này không?',
        },
        ok: { id: 'module.base.button.ok', defaultMessage: 'Đồng ý' },
        cancel: { id: 'module.base.button.cancel', defaultMessage: 'Không' },
    });

    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues } = props;

    const [activeIndex, setActiveIndex] = useState(0);
    const [slider, setSlider] = useState([{}]);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError, index) => {
        console.log('BANNER');
        executeUpFile({
            data: { type: 'SETTING', file: file },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess(response.data.filePath);
                    console.log('BANNER');
                    form.setFieldValue(['slider', index, 'image'], response.data.filePath);
                    setSlider([...form.getFieldValue('slider')]);
                    setIsChangedFormValues(true);
                    showSuccessMessage(translate.formatMessage(message.uploadSuccess));
                }
            },
            onError: (error) => {
                console.log(error);
                onError(error);
                if (error.code == 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage(translate.formatMessage(message.uploadInvalid));
                }
            },
        });
    };



    const handleSubmit = (values) => {
        const payload = {
            ...dataDetail,
            valueData: JSON.stringify(values),
        };
        return mixinFuncs.handleSubmit(payload);
    };

    useEffect(() => {
        if (dataDetail?.valueData) {
            try {
                const parsedData = JSON.parse(dataDetail.valueData);
                form.setFieldsValue(parsedData);
                console.log(parsedData);
                if (parsedData.slider && parsedData.slider.length > 0) {
                    setSlider(parsedData.slider);
                }
            } catch (error) {
                console.error("Parse JSON error", error);
            }
        }
    }, [dataDetail, form]);

    const currentImageUrl = form.getFieldValue(['slider', activeIndex, 'image']);

    const handleAddSlider = () => {
        const currentData = form.getFieldValue('slider') || [];
        const newData = [...currentData, {}];
        form.setFieldsValue({ slider: newData });
        setSlider(newData);
        setActiveIndex(newData.length - 1);
    };

    const handleRemoveSlider = (index) => {
        if (slider.length <= 1) return;
        const currentData = form.getFieldValue('slider') || [];
        const newData = currentData.filter((_, idx) => idx !== index);

        form.setFieldsValue({ slider: newData });
        setSlider(newData);
        if (activeIndex >= newData.length) {
            setActiveIndex(newData.length - 1);
        }
    };

    const showDeleteItemConfirm = (index) => {
        Modal.confirm({
            title: translate.formatMessage(message.deleteConfirmTitle),
            content: translate.formatMessage(message.deleteConfirmcontent),
            okText: translate.formatMessage(message.ok),
            cancelText: translate.formatMessage(message.cancel),
            centered: true,
            cancelButtonProps: { danger: true },
            style: { top: '-30%' },
            onOk: () => {
                handleRemoveSlider(index);
            },
        });
    };


    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                {slider.map((_, i) => (
                    <div
                        key={i}
                        style={{ display: activeIndex === i ? 'block' : 'none' }}
                    >
                        <PageConfigFormItem
                            index={i}
                            slider={slider}
                            handleRemoveSlider={showDeleteItemConfirm}
                            uploadFile={uploadFile}
                            translate={translate}
                            currentImageUrl={form.getFieldValue(['slider', i, 'image'])}
                        />
                    </div>
                ))}
                <SliderPagination
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    slider={slider}
                    handleAddSlider={handleAddSlider}
                />

                <div className={styles.videoSection}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.video)}
                                name="video"
                                placeholder="https://youtu.be/..."
                            />
                        </Col>

                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.descriptionTitle)}
                                name={['description', 'title']}
                            />
                        </Col>
                        <Col span={24}>
                            <TextField
                                label={translate.formatMessage(commonMessage.description)}
                                name={['description', 'description']}
                                type="textarea"
                                autoSize={{ minRows: 6, maxRows: 10 }}
                            />
                        </Col>
                    </Row>
                </div>

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default PageConfigForm;