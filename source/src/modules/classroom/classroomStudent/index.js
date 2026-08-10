import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip } from '@itz/react-cms-element';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { classroomStudentStateOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, Tag, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DATE_FORMAT_DISPLAY } from '@constants';
import useFetch from '@hooks/useFetch';
import dayjs from 'dayjs';
import { showSuccessMessage, showErrorMessage } from '@services/notifyService';

const ClassroomStudentistPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayName] = useState(searchParams.get('classroomName'));
    const stateValue = translate.formatKeys(classroomStudentStateOptions, ['label']);
    const { execute: executeChangeState } = useFetch(apiConfig.classroomStudent.changeState);
    const approveState = classroomStudentStateOptions[1].value;
    const rejectState = classroomStudentStateOptions[2].value;

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.classroomStudent,
            changeStatus: apiConfig.classroomStudent.changeState,
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
            funcs.getCreateLink = () => {
                return `${pagePath}/create${search}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    ...params,
                    classroomId: id,
                });
            };
            funcs.additionalActionColumnButtons = () => ({
                approve: (record) => {
                    if (record.state === approveState || record.state === rejectState) return null;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroomStudent.changeState.permissionCode]);
                    return (
                        <BaseTooltip title="Duyệt" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modal.confirm({
                                        title: 'Xác nhận Duyệt',
                                        content: 'Bạn có chắc chắn muốn duyệt sinh viên này?',
                                        onOk: () => {
                                            executeChangeState({
                                                data: {
                                                    id: record.id,
                                                    state: approveState,
                                                },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        showSuccessMessage('Duyệt sinh viên thành công!');
                                                        mixinFuncs.getList();
                                                    } else {
                                                        showErrorMessage('Duyệt sinh viên thất bại!');
                                                    }
                                                },
                                                onError: (error) => {
                                                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                                                },
                                            });
                                        },
                                    });
                                }}
                                disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <CheckOutlined style={{ color: !hasPerm ? '' : 'green' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                reject: (record) => {
                    if (record.state === approveState || record.state === rejectState) return null;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroomStudent.changeState.permissionCode]);
                    return (
                        <BaseTooltip title="Từ chối" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modal.confirm({
                                        title: 'Xác nhận Từ chối',
                                        content: 'Bạn có chắc chắn muốn từ chối sinh viên này?',
                                        onOk: () => {
                                            executeChangeState({
                                                data: {
                                                    id: record.id,
                                                    state: rejectState,
                                                },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        showSuccessMessage('Từ chối sinh viên thành công!');
                                                        mixinFuncs.getList();
                                                    } else {
                                                        showErrorMessage('Từ chối sinh viên thất bại!');
                                                    }
                                                },
                                                onError: (error) => {
                                                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                                                },
                                            });
                                        },
                                    });
                                }}
                                disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <CloseOutlined style={{ color: !hasPerm ? '' : 'red' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroomStudent.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record.id);
                                }}
                                disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: !hasPerm ? '' : 'red' }} />
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
            render: (_, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: ['student', 'account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: ['student', 'account', 'email'],
            width: 140,
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: ['student', 'account', 'phone'],
            width: 140,
        },
        {
            title: translate.formatMessage(commonMessage.dateRegistration),
            dataIndex: 'dateRegistration',
            width: 150,
            render: (date) => date ? dayjs(date).format(DATE_FORMAT_DISPLAY) : '-',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            width: 160,
            align: 'center',
            render: (stateValue) => {
                const option = classroomStudentStateOptions.find((item) => item.value === stateValue);
                if (!option) return null;
                return (
                    <Tag color={option.color} style={{ display: 'inline-block', width: '70%', textAlign: 'center', fontSize: 14 }}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {translate.formatMessage(option.label)}
                        </div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                approve: true,
                reject: true,
                delete: true,
            },
            { width: 150, align: 'center' },
        ),
    ];

    const searchFields = [
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValue,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate, displayName)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
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

export default ClassroomStudentistPage;