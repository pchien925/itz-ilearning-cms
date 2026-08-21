import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { BaseTable, PageWrapper, ListPage, BaseTooltip, TextClamp } from '@itz/react-cms-element';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { classroomStateOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty, Tag, Modal } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/useFetch';
import { convertUtcToLocalTime, DEFAULT_FORMAT, formatMoney, orderNumber, showErrorMessage, showSuccessMessage } from '@itz/react-utils';

const ClassroomListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const stateValue = translate.formatKeys(classroomStateOptions, ['label']);
    const [pendingOption, activeOption, doneOption, cancelOption] = classroomStateOptions;
    const pendingState = pendingOption.value;
    const activeState = activeOption.value;
    const completeState = doneOption.value;
    const rejectState = cancelOption.value;
    const { execute: executeChangeState } = useFetch(apiConfig.classroom.changeState);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.classroom,
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
            const originalChangeFilter = funcs.changeFilter;
            funcs.changeFilter = (filter) => {
                originalChangeFilter({ ...filter, page: 1 });
            };
            funcs.additionalActionColumnButtons = () => ({
                activate: (record) => {
                    if (record.state !== pendingState) return null;
                    // const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.changeState.permissionCode]);
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.classroomActivate)} objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modal.confirm({
                                        title: translate.formatMessage(commonMessage.classroomActivateConfirmTitle),
                                        content: '',
                                        onOk: () => {
                                            executeChangeState({
                                                data: { id: record.id, state: activeState },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        showSuccessMessage(translate.formatMessage(commonMessage.classroomActivateSuccess));
                                                        mixinFuncs.getList();
                                                    } else {
                                                        showErrorMessage('Kích hoạt thất bại!');
                                                    }
                                                },
                                                onError: (error) => {
                                                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                                                },
                                            });
                                        },
                                    });
                                }}
                                // disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <CheckOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },

                complete: (record) => {
                    if (record.state !== activeState) return null;
                    // const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.changeState.permissionCode]);
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.classroomMarkDone)} objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modal.confirm({
                                        title: translate.formatMessage(commonMessage.classroomMarkDoneConfirmTitle),
                                        content: '',
                                        onOk: () => {
                                            executeChangeState({
                                                data: { id: record.id, state: completeState },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        showSuccessMessage('Hoàn thành thành công!');
                                                        mixinFuncs.getList();
                                                    } else {
                                                        showErrorMessage('Hoàn thành thất bại!');
                                                    }
                                                },
                                                onError: (error) => {
                                                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                                                },
                                            });
                                        },
                                    });
                                }}
                                // disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <CheckCircleOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },

                cancel: (record) => {
                    if (record.state !== activeState) return null;
                    // const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.changeState.permissionCode]);
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.classroomCancelClass)} objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Modal.confirm({
                                        title: translate.formatMessage(commonMessage.classroomCancelClassConfirmTitle),
                                        content: '',
                                        onOk: () => {
                                            executeChangeState({
                                                data: { id: record.id, state: rejectState },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        showSuccessMessage('Huỷ lớp học thành công!');
                                                        mixinFuncs.getList();
                                                    } else {
                                                        showErrorMessage('Huỷ lớp học thất bại!');
                                                    }
                                                },
                                                onError: (error) => {
                                                    showErrorMessage(error?.message || 'Đã có lỗi xảy ra khi thực hiện thao tác!');
                                                },
                                            });
                                        },
                                    });
                                }}
                                // disabled={!hasPerm}
                                style={{ padding: 0 }}
                            >
                                <CloseCircleOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },

                edit: (record) => {
                    const canEdit = record.state === pendingState;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.update.permissionCode]);
                    const isDisabled = !hasPerm || !canEdit;

                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(record), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                                type="link"
                                style={{ padding: 0 }}
                                disabled={isDisabled}
                            >
                                <EditOutlined style={{ color: !hasPerm ? '' : 'rgba(0, 0, 0, 0.25)' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.classroom.delete.permissionCode]);
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
            width: 40,
            render: (_, record, index) => orderNumber(pagination, index, pagination.pageSize),
        },
        {
            title: translate.formatMessage(commonMessage.course),
            dataIndex: ['course', 'name'],
            width: 500,
            render: (name, record) => {
                if (!record.course) return '-';
                return (
                    <div
                        style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 400 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            const id = record.id;
                            const encodedName = encodeURIComponent(name);
                            navigate(`/classroom/${id}/student?classroomName=${encodedName}`);
                        }}
                    >
                        <TextClamp lineClamp={2}>{name}</TextClamp>
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            width: 140,
            render: (date) => {
                if (!date) return '-';
                return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
            },
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            width: 140,
            render: (date) => {
                if (!date) return '-';
                return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
            },
        },
        {
            title: translate.formatMessage(commonMessage.price),
            dataIndex: 'price',
            width: 140,
            align: 'right',
            render: (price) => {
                if (price == null) return '-';
                return formatMoney(price, {
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    currentcy: 'đ',
                });
            },
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            width: 140,
            align: 'center',
            render: (stateValue) => {
                const option = classroomStateOptions.find((item) => item.value === stateValue);
                if (!option) return null;
                return (
                    <Tag color={option.color} style={{ display: 'inline-block', width: '100%', textAlign: 'center', fontSize: 14 }}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>
                            {translate.formatMessage(option.label)}
                        </div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                activate: true,
                complete: true,
                cancel: true,
                edit: true,
                delete: true,
            },
            { width: 150, align: 'right' },
        ),
    ];

    const searchFields = [
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.course),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            mappingOptions: (item) => ({ label: item.name, value: item.id }),
            useFetch: useFetch,
            submitOnChanged: true,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValue,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
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

export default ClassroomListPage;