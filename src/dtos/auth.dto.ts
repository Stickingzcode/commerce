import { ObjectId } from "mongoose"

export interface RegisterDTO{
    email: string,
    password: string,
    userType: string,
    callbackUrl: string
    verifyType: string
}

export interface LoginDTO{
    email: string,
    password: string
}

export interface ActivateAcccountDTO{
    type: string,
    token: string,
    code: string
}

export interface GenerateAuthTokenDTO{
    id: ObjectId
    email: string,
    roles: Array<ObjectId>
}