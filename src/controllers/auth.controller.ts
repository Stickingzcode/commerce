import { Request, Response, NextFunction } from 'express'
import { RegisterDTO } from '../dtos/auth.dto';
import { UserTypeEnum } from '../utils/enums.util';
import AuthService from '../services/auth.service';
import ErrorResponse from '../utils/error.util';
import { PASSWORD_REGXP_ERROR } from '../utils/constants.util';
import UserService from '../services/user.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, userType } = <RegisterDTO>req.body;

    const validate = await AuthService.validateRegister(req.body);

    if(validate.error){
        return next(new ErrorResponse('Error', validate.code, [`${validate.message}`]))
    }
    
    // validate email
    const isEmailMatch = await UserService.checkEmail(email)
    if(!isEmailMatch){
        return next(new ErrorResponse('Error', 400, ['invalid email supplied']));
    }

    //TODO: validate existing email

    // validate the password
    const isPassMatch = await UserService.checkPassword(password);
    if(!isPassMatch){
        return next(new ErrorResponse('Error', 400, [`invalid password supplied. ${PASSWORD_REGXP_ERROR}`]));
    }

    // save user details
    // send welcome/verification email 

    res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'successful',
        status: 200
    })

}