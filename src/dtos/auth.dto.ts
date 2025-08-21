import { ObjectId } from "mongoose"
import { LoginMethod } from "../utils/types.util"

export interface RegisterDTO {
    email: string,
    password: string,
    userType: string,
    callbackUrl: string
    verifyType: string
}

export interface LoginDTO {
    email: string,
    password: string,
    method: LoginMethod,
    hash?: string
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