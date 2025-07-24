import { Request, Response, NextFunction } from 'express'
import { ActivateAcccountDTO, RegisterDTO } from '../dtos/auth.dto';
import { UserTypeEnum, VerifyTypeEnum } from '../utils/enums.util';
import AuthService from '../services/auth.service';
import ErrorResponse from '../utils/error.util';
import { PASSWORD_REGXP_ERROR } from '../utils/constants.util';
import UserService from '../services/user.service';
import User from '../models/User.model';
import { UserType } from '../utils/types.util';
import EmailService from '../services/email.service';
import SystemService from '../services/system.service';

/**
 * @name register
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, userType, callbackUrl } = <RegisterDTO>req.body;

    const validate = await AuthService.validateRegister(req.body);

    if(validate.error){
        return next(new ErrorResponse('Error', validate.code, [`${validate.message}`]))
    }
    
    // validate email
    const isEmailMatch = await UserService.checkEmail(email);
    if(!isEmailMatch){
        return next(new ErrorResponse('Error', 400, ['invalid email supplied']));
    }

    // validate existing user
    const isExist = await UserService.userExists(email);
    if(isExist){
        return next(new ErrorResponse('Error', 422, ['email already exist']))
    }

    // validate the password
    const isPassMatch = await UserService.checkPassword(password);
    if(!isPassMatch){
        return next(new ErrorResponse('Error', 400, [`invalid password supplied. ${PASSWORD_REGXP_ERROR}`]));
    }

    const user = await UserService.createUser({
        email: email,
        password: password,
        userType: userType as UserType,
        firstName: `New ${userType}`,
        lastName: 'User'
    });

    // generate and hash verification token
    const { token, hash } = await user.getActivationToken()
    user.activationToken = hash;
    user.activationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins;
    await user.save();

    // send verification email
    await EmailService.sendTokenVerifyEmail({
        driver: 'sengrid',
        email: user.email,
        template: 'verify_token',
        title: 'Verify Your Email',
        fromName: 'Victoria from Commerce',
        preheader: 'Confirm your email address',
        options: {
            salute: `Champ`,
            buttonText: 'Verify Email',
            buttonUrl: `${callbackUrl}/${token}`
        }
    })

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
        },
        message: 'successful',
        status: 200
    })

}

export const activateAccount = async (req: Request, res: Response, next: NextFunction) => {

    const { token, type, code } = <ActivateAcccountDTO>req.body;

    const validate = await AuthService.validateActivate(req.body);

    if(validate.error){
        return next(new ErrorResponse('Error', validate.code!, [validate.message]))
    }

    if(type === VerifyTypeEnum.TOKEN){

    }


    if(type === VerifyTypeEnum.CODE){
        
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'successful',
        status: 200
    })

}