import { defineMessages } from "react-intl";

export const errorCode = defineMessages({
    "ERROR-CLASSROOM-001": {
        message: {
            id: "errorCode.ERROR-CLASSROOM-001",
            defaultMessage: "Classroom not found",
        },
    },
    "ERROR-CLASSROOM-002": {
        message: {
            id: "errorCode.ERROR-CLASSROOM-002",
            defaultMessage: "Classroom is not active",
        },
    },
    "ERROR-COURSE-000": {
        message: {
            id: "errorCode.ERROR-COURSE-000",
            defaultMessage: "Course not found",
        },
    },
    "ERROR-SYLLABUS-001": {
        message: {
            id: "errorCode.ERROR-SYLLABUS-001",
            defaultMessage: "Không thể xóa chương đầu tiên khi vẫn còn bài học trực thuộc chương này",
        },
    },
    "ERROR-GROUP-0004": {
        message: {
            id: "errorCode.ERROR-GROUP-0004",
            defaultMessage: "Quyền này đang được sử dụng, không thể xóa",
        },
    },
    "ERROR-ACCOUNT-0001": {
        message: {
            id: "errorCode.ERROR-ACCOUNT-0001",
            defaultMessage: "Tên đăng nhập hoặc email đã tồn tại!",
        },
    },
});