import { PageWrapper } from '@itz/react-cms-element';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MentorForm from './MentorForm';


const MentorSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: {
            getById: apiConfig.mentor.getById,
            create: apiConfig.mentor.create,
            update: apiConfig.mentor.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,                     
                    avatarPath: data.avatarPath,
                    groupId: data.group?.id,    
                    kind: pageOptions?.kind,
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,                     
                    kind: pageOptions?.kind,
                    avatarPath: data.avatarPath,
                    status: STATUS_ACTIVE,
                    groupId: data.group?.id,     
                };
            };
            funcs.mappingData = (response) => {
                if (!response || !response.data) return {};
                const { account, ...rest } = response.data; 
                return {
                    ...rest,      
                    ...account,   
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
            <MentorForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                kind={pageOptions?.kind}
            />
        </PageWrapper>
    );
};

export default MentorSavePage;
