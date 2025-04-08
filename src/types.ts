
export type APIResponse<T> = {
    code: number,
    data: T | null
}

export type CallAPI<T> = {
    data: T | null;
    error: ErrorResponse | null
}
export type ErrorResponse = {
    code: number,
    message: string,
}

export type LoginResponse = {
    accessToken: string;
    authenticated: boolean;
}
export type RefreshAccessTokenResponse = {
    valid: boolean;
    accessToken: string;
    isNewToken: boolean;
}

export type TeacherResponse = {
    fullName: string,
    email: string,
    avatar: string;
    dob: string;
    posts: PostResponse[];
    roles: Role[];
}
const enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    TEACHER = "TEACHER"
}

export type PostResponse = {
    title: string,
    datePost: string,
    dateEnd: string,
    wagePayment: WagePayment;
    typeTimeWork: TypeTimeWork;
    experience: number;
    wage: number;
}


const enum TypeTimeWork {
    FULLTIME = "FULLTIME",
    PARTTIME = "PARTTIME",

}
const enum WagePayment {
    DAY = "DAY",
    HOUR = "HOUR",
    WEEK = "WEEK",
    MONTH = "MONTH"

}
export type ResponsePromise<T> = {
    response: T,
    loading: boolean,
    errors: ErrorResponse,
}