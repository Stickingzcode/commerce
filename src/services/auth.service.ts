import { ActivateAcccountDTO, RegisterDTO } from "../dtos/auth.dto";
import { UserTypeEnum, VerifyTypeEnum } from "../utils/enums.util";
import { IResult } from "../utils/interfaces.util";
import SystemService from "./system.service";

class AuthService {

    constructor() {
    }

    /**
     * @name validateRegister
     * @description Validates register endpoint
     * @param data 
     * @returns {IResult} - IResult
     */
    public async validateRegister(data: RegisterDTO): Promise<IResult> {

        const allowedTypes = ['code', 'token'];
        const allowedUsers: Array<string> = [UserTypeEnum.VENDOR, UserTypeEnum.CUSTOMER]

        let result: IResult = { error: false, message: '', code: 200, data: null }
        const { email, password, userType, callbackUrl, verifyType } = data;

        if (!email) {
            result.error = true;
            result.code = 400;
            result.message = 'email is required'
        } else if (!password) {
            result.error = true;
            result.code = 400;
            result.message = 'password is required'
        } else if (!userType) {
            result.error = true;
            result.code = 400;
            result.message = 'userType is required'
        } else if (!allowedUsers.includes(userType)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid user type. choose from ${allowedUsers.join(',')}`
        } else if (!callbackUrl) {
            result.error = true;
            result.code = 400;
            result.message = 'callback url is required'
        } else if (!verifyType) {
            result.error = true;
            result.code = 400;
            result.message = 'verify type is required'
        } else if (!allowedTypes.includes(verifyType)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid verify type. choose from ${allowedTypes.join(',')}`
        } else {
            result.error = false;
            result.code = 200;
            result.message = ''
        }

        return result

    }

    /**
     * @name validateActivate
     * @param data 
     * @returns 
     */
    public async validateActivate(data: ActivateAcccountDTO): Promise<IResult> {

        let result: IResult = { error: false, message: '', code: 200, data: null }
        const allowedTypes = SystemService.enumToArray(VerifyTypeEnum, 'values-only');

        const { code, token, type } = data;

        if (!type) {
            result.error = true;
            result.code = 400;
            result.message = 'activation type is required'
        } else if (!allowedTypes.includes(type)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid activation type. choose from ${allowedTypes.join(',')}`
        } else if (type === VerifyTypeEnum.TOKEN && !token) {
            result.error = true;
            result.code = 400;
            result.message = 'token is required'
        } else if (type === VerifyTypeEnum.CODE && !code) {
            result.error = true;
            result.code = 400;
            result.message = 'code is required'
        } else {
            result.error = false;
            result.code = 200;
            result.message = ''
        }

        return result;

    }

}

export default new AuthService();