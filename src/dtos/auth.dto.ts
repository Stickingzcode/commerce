import { ObjectId } from "mongoose";
import { LoginMethod } from "../utils/types.utils";

export interface GenerateAuthTokenDTO {
    id: ObjectId,
    email: string, 
    roles: Array<ObjectId>,
}

export interface LoginDTO {
    email: string,
    password: string,
    method: LoginMethod,
    hash?: string,
}

export interface ActivateAccountDTO {
    type: string,
    token: string,
    code: string,
}

export interface RegisterDTO {
    email: string,
    password: string,
    userType: string,
    callbackurl: string,
    verifyType: string,
}

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
