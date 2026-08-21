import { PageWrapper } from '@itz/react-cms-element';
import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ClassroomForm from './ClassroomForm';
import { convertLocalTimeToUtc, DEFAULT_FORMAT } from '@itz/react-utils';

const ClassroomSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: {
            getById: apiConfig.classroom.getById,
            create: apiConfig.classroom.create,
            update: apiConfig.classroom.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    courseId: data.course?.id ?? data.courseId,
                    startDate: data.startDate ? convertLocalTimeToUtc(data.startDate, DEFAULT_FORMAT, DEFAULT_FORMAT) : null,
                    endDate: data.endDate ? convertLocalTimeToUtc(data.endDate, DEFAULT_FORMAT, DEFAULT_FORMAT) : null,
                    id: id,
                };
            };

            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    courseId: data.course?.id ?? data.courseId,
                    startDate: data.startDate ? convertLocalTimeToUtc(data.startDate, DEFAULT_FORMAT, DEFAULT_FORMAT) : null,
                    endDate: data.endDate ? convertLocalTimeToUtc(data.endDate, DEFAULT_FORMAT, DEFAULT_FORMAT) : null,
                };
            };
            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
            funcs.onSaveError = (err) => {
                const errorInfo = errorCode[err?.code];
                if (errorInfo) {
                    showErrorMessage(translate.formatMessage(errorInfo.message));
                } else {
                    showErrorMessage(err?.message);
                }
                setSubmit(false);
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <ClassroomForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default ClassroomSavePage;