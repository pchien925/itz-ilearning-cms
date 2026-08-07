import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage } from '@itz/react-utils';
import { commonMessage } from '@locales/intl';
import { accountActions } from '@store/actions';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import ProfileForm from './ProfileForm';
import { PageWrapper } from '@itz/react-cms-element';

const message = defineMessages({
    objectName: 'profile',
});

const ProfilePage = () => {
    const translate = useTranslate();
    const [detail, setDetail] = useState({});
    const { execute, loading } = useFetch({ ...apiConfig.account.getProfile }, { immediate: false });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile);
    const { profile } = useAuth();
    const { mixinFuncs, onSave, setIsChangedFormValues, isEditing, setSubmit } = useSaveBase({
        options: {
            getListUrl: `/`,
            objectName: translate.formatMessage(message.objectName),
        },
        apiConfig: {
            getById: apiConfig.account.getProfile,
            update: apiConfig.account.updateProfile,
        },
        override: (funcs) => {
            const onSaveCompleted = funcs.onSaveCompleted;

            funcs.onSaveCompleted = (response) => {
                onSaveCompleted(response);
                executeGetProfile();
            };
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: profile?.id,
                    status: STATUS_ACTIVE,
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

    useEffect(() => {
        execute({
            onCompleted: (response) => {
                if (response.result === true) setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    }, []);

    return (
        <PageWrapper
            loading={loading}
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.profile) },
            ]}
        >
            <ProfileForm
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

export default ProfilePage;
