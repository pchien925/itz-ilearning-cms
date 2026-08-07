import apiConfig from '@constants/apiConfig';
import { errorCode } from '@constants/errorCode';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { PageWrapper } from '@itz/react-cms-element';
import { showErrorMessage } from '@itz/react-utils';
import { commonMessage } from '@locales/intl';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PermissionForm from './PermissionForm';

const PermissionSavePage = ({ pageOptions }) => {
     const translate = useTranslate();
    const location = useLocation();
    const search = location.search;
    const [permissions, setPermissions] = useState([]);
    const { execute: executeGetPermission } = useFetch(apiConfig.groupPermission.getPermissionList, {
        immediate: false,
    });

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: apiConfig.groupPermission,
        options: {
            getListUrl: pageOptions.listPageUrl + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        ...response.data,
                        permissions: response.data?.permissions
                            ? response.data?.permissions.map((permission) => permission.id)
                            : [],
                    };
                }
                return null;
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
        executeGetPermission({
            params: {
                size: 1000,
            },
            onCompleted: (res) => {
                setPermissions(res?.data?.content);
            },
        });
    }, []);

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <PermissionForm
                size="normal"
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                permissions={permissions || []}
            />
        </PageWrapper>
    );
};

export default PermissionSavePage;
