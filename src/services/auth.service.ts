import { RegisterDTO } from "../dtos/auth.dto";
import { UserTypeEnum } from "../utils/enums.util";
import { IResult } from "../utils/interfaces.util";

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

        const allowedUsers: Array<string> = [UserTypeEnum.VENDOR, UserTypeEnum.CUSTOMER]

        let result: IResult = { error: false, message: '', code: 200, data: null }
        const { email, password, userType } = data;

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
        } else {
            result.error = false;
            result.code = 200;
            result.message = ''
        }

        return result

    }

}

export default new AuthService();