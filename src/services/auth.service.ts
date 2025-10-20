import { LoginMethodEnum, UserTypeEnum, VerifyTypeEnum, APPChannelEnum } from "../utils/enums.utils";
import { IResult } from "../utils/interfaces.utils";
import SystemService from "./system.service";
import { RegisterDTO, ActivateAccountDTO, GenerateAuthTokenDTO, LoginDTO } from "../dtos/auth.dto";
import jwt from "jsonwebtoken";

class AuthService {
    constructor(){}

    public async validateRegister(data: RegisterDTO): Promise<IResult> {
        const allowedTypes = ['code', 'token'];
        const allowedUsers: Array<string> = [UserTypeEnum.VENDOR, UserTypeEnum.CUSTOMER]

        let result: IResult = {error: false, message: '', code: 200, data: null}
        const { email, password, userType, callbackurl, verifyType } = data;

        if(!email) {
            result.error = true;
            result.code = 400;
            result.message = 'email is required';
        } else if(!password) {
            result.error = true;
            result.code = 400;
            result.message = 'password is required';
        } else if(!userType) {
            result.error = true;
            result.code = 400;
            result.message = 'userType is required';
        } else if(!allowedUsers.includes(userType)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid user type. select from ${allowedUsers.join(',')}`;
        } else if(!callbackurl) {
            result.error = true;
            result.code = 400;
            result.message = 'callbackurl is required';
        } else if(!verifyType) {
            result.error = true;
            result.code = 400;
            result.message = 'verify type is required';
        } else if(!allowedTypes.includes(verifyType)) {
            result.error = true;
            result.code = 400;
            result.message =`invalid verify type. select from ${allowedTypes.join(',')}`
        } else {
            result.error = false;
            result.code = 200;
            result.message = 'successful';
        }

        return result;

    }

    public async validateActivate(data: ActivateAccountDTO): Promise<IResult> {
        let result: IResult = {error: false, message: '', code: 200, data: null}

        const { code, token, type } = data;
        const allowedTypes = SystemService.enumToArray(VerifyTypeEnum, 'values-only')

        if(!type) {
            result.error = true;
            result.code = 400;
            result.message = 'activation type is required';
        } else if(!allowedTypes.includes(type)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid activation type. select from ${allowedTypes.join(',')}`;
        } else if(type === VerifyTypeEnum.TOKEN && !token) {
            result.error = true;
            result.code = 400;
            result.message = 'token is required';
        } else if(type === VerifyTypeEnum.CODE && !code) {
            result.error = true;
            result.code = 400;
            result.message = 'code is required';
        } else {
            result.error = false;
            result.code = 200;
            result.message = 'successful';
        }
        return result;
    }

    public async validateLogin(data: LoginDTO, channel: string): Promise<IResult> {
        const alloedMethods = SystemService.enumToArray(LoginMethodEnum, 'values-only');
        let result: IResult = { error: false, data: null, message: '', code: 200 };
        const { email, password, method, hash } = data;

        if(!email) {
            result.error = true;
            result.code = 400;
            result.message = 'email is required';
        } else if(!password) {
            result.error = true;
            result.code = 400;
            result.message = 'password is required';
        } else if(!method) {
            result.error = true;
            result.code = 400;
            result.message = 'userType is required';
        } else if(!alloedMethods.includes(method)) {
            result.error = true;
            result.code = 400;
            result.message = `invalid user type. select from ${alloedMethods.join(',')}`;
        } else {
            if(method === LoginMethodEnum.BIOMETRIC && channel !== APPChannelEnum.MOBILE) {
                result.error = true;
                result.message = `invalid login method for a ${channel} device`;
                result.code = 400;
            } if(method === LoginMethodEnum.BIOMETRIC && !hash) {
                result.error = true;
                result.message = `encrypted hash is required`;
                result.code = 400;
            } else {
            result.error = false;
            result.code = 200;
            result.message = 'successful';
        }
    }

        return result;
    }

    public async generateAuthToken(data: GenerateAuthTokenDTO): Promise<string> {

        const secret = process.env.JWT_SECRET || '';
        const expire = 60 * 60 * (parseInt(process.env.JWT_EXPIRE || ''));

        const signed = jwt.sign(data, secret, { expiresIn: expire })

        return signed;
    }
}

export default new AuthService();