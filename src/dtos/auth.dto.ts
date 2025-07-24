export interface RegisterDTO{
    email: string,
    password: string,
    userType: string,
    callbackUrl: string
}

export interface ActivateAcccountDTO{
    type: string,
    token: string,
    code: string
}