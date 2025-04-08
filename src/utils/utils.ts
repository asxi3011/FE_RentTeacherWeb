import memoizee from "memoizee"
import { FieldError } from "react-hook-form";

export const convertToAlias = memoizee((name: string) => {
    return name
        .normalize("NFD") // Chuyển thành dạng kết hợp
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .toLowerCase() // Chuyển thành chữ thường
        .replace(/[^a-z0-9 ]/g, "") // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, "-");
})

export const detachUniversity = memoizee((university: string) => {
    const [name, code] = university.split(" - ");
    const alias = convertToAlias(name);
    return { name, code, alias }
})

export const detachSchoolYear = ((university: string) => {
    const [start, end] = university.split(" - ");

    return { start, end }
})

export const getHelperTextMessage = ((error: any) => {
    const errorMessage = error as FieldError
    return (errorMessage || typeof errorMessage !== "undefined") ? errorMessage.message : ""
})