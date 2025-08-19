import { ObjectId } from "mongoose"

export interface RegisterDTO {
    email: string,
    password: string,
    userType: string,
    callbackUrl: string
    verifyType: string
}

export interface LoginDTO {
    email: string,
    password: string
}

export interface ActivateAcccountDTO {
    type: string,
    token: string,
    code: string
}

export interface GenerateAuthTokenDTO {
    id: ObjectId
    email: string,
    roles: Array<ObjectId>
}


// Mappers
export interface MapLoginResponseDTO {
    _id: ObjectId,
    id: ObjectId,
    email: string,
    userType: string,
    isSuper: boolean,
    isAdmin: boolean,
    isVendor: boolean,
    isCustomer: boolean,
    isUser: boolean,
    roles: Array<string>
}