import { DeleteOutlined, EditOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, AvatarField, TextField, TextClamp } from '@itz/react-cms-element';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, KIND_ADMIN, STATUS_DELETE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, Modal } from 'antd';
import useFetch from '@hooks/useFetch';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertUtcToLocalTime, DEFAULT_FORMAT, orderNumber } from '@itz/react-utils';

const RegistrationListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const { execute: executeChangeState } = useFetch(apiConfig.classroomStudent.changeState);


    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.registration,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            const originalChangeFilter = funcs.changeFilter;
            funcs.changeFilter = (filter) => {
                originalChangeFilter({ ...filter, page: 1 });
            };
            funcs.additionalActionColumnButtons = () => ({
                // approve: (record) => {
                //     // if (record.state === approveState || record.state === rejectState) return null;
                //     const hasPerm = mixinFuncs.hasPermission([apiConfig.classroomStudent.changeState.permissionCode]);
                //     return (
                //         <BaseTooltip title="Duyệt" objectName={translate.formatMessage(pageOptions.objectName)}>
                //             <Button
                //                 type="link"
                //                 onClick={(e) => {
                //                     e.stopPropagation();
                //                     Modal.confirm({
                //                         title: 'Xác nhận Duyệt',
                //                         content: 'Bạn có chắc chắn muốn duyệt sinh viên này?',
                //                         onOk: () => {
                //                             executeChangeState({
                //                                 data: {
                //                                     id: record.id,
                //                                     state: approveState,
                //                                 },
                //                                 onCompleted: (response) => {
                //                                     if (response.result === true) {
                //                                         showSuccessMessage('Duyệt sinh viên thành công!');
                //                                         mixinFuncs.getList();
                //                                     } else {
                //                                         showErrorMessage('Duyệt sinh viên thất bại!');
                //                                     }
                //                                 },
                //                                 onError: (error) => {
                //                                     showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                //                                 },
                //                             });
                //                         },
                //                     });
                //                 }}
                //                 disabled={!hasPerm}
                //                 style={{ padding: 0 }}
                //             >
                //                 <CheckOutlined style={{ color: !hasPerm ? '' : 'green' }} />
                //             </Button>
                //         </BaseTooltip>
                //     );
                // },
                delete: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.registration.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record.id);
                                }}
                                disabled={!hasPerm || isDelete}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: (!hasPerm || isDelete) ? '' : 'red' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });
    const columns = [
        {
            title: '#',
            align: 'left',
            width: 60,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
        },
        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: ['fullName'],
            width: 220,
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: ['email'],
            width: 240,
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: ['phone'],
            width: 200,
        },
        {
            title: translate.formatMessage(commonMessage.course),
            dataIndex: ['classroom', 'course', 'name'],
            width: 300,
            render: (name, record) => {
                if (!record.classroom.course?.name) return '-';
                return (
                    <TextClamp lineClamp={2}>{name}</TextClamp>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: 160,
            render: (date) => {
                if (!date) return '-';
                return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
            },
        },
        mixinFuncs.renderStatusColumn({ width: 160 }),
        mixinFuncs.renderActionColumn(
            {
                // approve: true,
                delete: true,
            },
            { width: 150, align: 'center' },
        ),
    ];

    const searchFields = [
        {
            key: 'phone',
            placeholder: translate.formatMessage(commonMessage.phone),
            type: FieldTypes.STRING,
            renderItem: () => <TextField placeholder={translate.formatMessage(commonMessage.phone)} />,
        },
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.classroom),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.classroom.autocomplete,
            mappingOptions: (item) => ({ label: item.name, value: item.id }),
            useFetch: useFetch,
            submitOnChanged: true,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValue,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default RegistrationListPage;