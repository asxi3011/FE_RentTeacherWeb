



export const mappingErrors: { [key: number]: string } = ({
    1007: "Tài khoản đang được đăng nhập ở nơi khác vui lòng xem xét lại.",
    5001: "User is already a teacher"
})

export const getMessageError = (value: number | undefined) => {
    if (value === undefined) {
        return "Truyền vào undefined";
    }
    return mappingErrors[value];
}