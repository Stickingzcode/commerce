import { Request, Response, NextFunction } from 'express'
import { ActivateAcccountDTO, LoginDTO, MapLoginResponseDTO, RegisterDTO } from '../dtos/auth.dto';
import { LoginMethodEnum, UserTypeEnum, VerifyTypeEnum } from '../utils/enums.util';
import AuthService from '../services/auth.service';
import ErrorResponse from '../utils/error.util';
import { PASSWORD_REGXP_ERROR } from '../utils/constants.util';
import UserService from '../services/user.service';
import User from '../models/User.model';
import { EmailDriver, UserType } from '../utils/types.util';
import EmailService from '../services/email.service';
import SystemService from '../services/system.service';
import UserRepository from '../repositories/user.repository';
import { ObjectId } from 'mongoose';
import AuthMapper from '../mappers/auth.mapper';
import logger from '../utils/logger.util';


export const register = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, userType, callbackUrl, verifyType } = <RegisterDTO>req.body;

    const validate = await AuthService.validateRegister(req.body);

    if (validate.error) {
        return next(new ErrorResponse('Error', validate.code, [`${validate.message}`]))
    }

    // validate email
    // const isEmailMatch = await UserService.checkEmail(email);
    // if(!isEmailMatch){
    //     return next(new ErrorResponse('Error', 400, ['invalid email supplied']));
    // }

    // validate existing user
    const isExist = await UserService.userExists(email);
    if (isExist) {
        return next(new ErrorResponse('Error', 422, ['email already exist']))
    }

    // validate the password
    const isPassMatch = await UserService.checkPassword(password);
    if (!isPassMatch) {
        return next(new ErrorResponse('Error', 400, [`invalid password supplied. ${PASSWORD_REGXP_ERROR}`]));
    }

    const user = await UserService.createUser({
        email: email,
        password: password,
        userType: userType as UserType,
        firstName: `New ${userType}`,
        lastName: 'User'
    });

    if (verifyType === VerifyTypeEnum.TOKEN) {

        // generate and hash verification token
        const { token, hash } = await user.getActivationToken()
        user.activationToken = hash;
        user.activationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins;
        await user.save();

        // send verification email
        await EmailService.sendTokenVerifyEmail({
            driver: (process.env.EMAIL_DRIVER || 'zepto') as EmailDriver,
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

    }

    if (verifyType === VerifyTypeEnum.CODE) {

        // generate and save code
        const otp = await UserService.generateOTP(user._id);

        // send verification email
        await EmailService.sendOTPVerifyEmail({
            driver: (process.env.EMAIL_DRIVER || 'zepto') as EmailDriver,
            email: user.email,
            template: 'verify_otp',
            title: 'Verify Your Email',
            fromName: 'Victoria from Commerce',
            preheader: 'Confirm your email address',
            options: {
                code: otp,
                salute: `Champ`,
            }
        })

    }

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

export const login = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, method, hash } = <LoginDTO>req.body;

    const validate = await AuthService.validateLogin(req.body, req.channel!);

    if (validate.error) {
        return next(new ErrorResponse('Error', validate.code!, [`${validate.message}`]))
    }

    const user = await UserRepository.findByEmailSelectPassword(email);

    if (!user) {
        return next(new ErrorResponse('Error', 404, [`incorrect login credentials`]))
    }

    if (!user.isActive) {
        return next(new ErrorResponse('Error', 403, [`inactive user account`]))
    }

    if (user.isLocked) {
        return next(new ErrorResponse('Error', 403, [`account currently locked`]))
    }

    if (!user.isSuper) {

        if(method === LoginMethodEnum.EMAIL){

            const isMatched = await user.matchPassword(password);
            
            if (!isMatched) {
    
                if (user.login.limit >= 3) {
    
                    if (!user.isLocked) {
                        user.isLocked = true;
                        await user.save();
                    }
    
                    return next(new ErrorResponse('Error', 403, [`account currently locked for 30 minutes`]))
    
                } else if (user.login.limit < 3) {
    
                    user.login.limit += 1;
                    await user.save();
    
                    if (user.login.limit === 3) {
    
                        user.isLocked = true;
                        await user.save();
    
                        return next(new ErrorResponse('Error', 403, [`account currently locked for 30 minutes`]))
    
                    } else {
                        return next(new ErrorResponse('Error', 403, [`incorrect login credentials`]))
                    }
    
                } else {
                    return next(new ErrorResponse('Error', 403, [`incorrect login credentials`]))
                }
            }

        }

        if(method === LoginMethodEnum.BIOMETRIC){
            
        }

        const today = new Date()
        user.isLocked = false;
        user.login.limit = 0;
        user.login.last = today.toISOString();
        user.login.method = LoginMethodEnum.EMAIL;
        await user.save();

        sendTokenResponse(user._id, res);

    }

    if (user.isSuper) {

        const isMatched = await user.matchPassword(password);

        if (!isMatched) {
            return next(new ErrorResponse('Error', 403, [`incorrect login credentials`]))
        }

        const today = new Date()
        user.isLocked = false;
        user.login.limit = 0;
        user.login.last = today.toISOString();
        user.login.method = LoginMethodEnum.EMAIL;
        await user.save();

        sendTokenResponse(user._id, res);

    }

}

export const activateAccount = async (req: Request, res: Response, next: NextFunction) => {

    const { token, type, code } = <ActivateAcccountDTO>req.body;

    const validate = await AuthService.validateActivate(req.body);

    if (validate.error) {
        return next(new ErrorResponse('Error', validate.code!, [validate.message]))
    }

    if (type === VerifyTypeEnum.TOKEN) {

        const hash = await SystemService.hashToken(token);
        const today = Date.now(); // 

        const user = await User.findOne({ activationToken: hash, activationTokenExpire: { $gte: today } });

        if (!user) {
            return next(new ErrorResponse('Error', 403, ['invalid activation token']))
        }

        user.isActivated = true;
        user.activationToken = undefined;
        user.activationTokenExpire = undefined;
        await user.save();

    }

    if (type === VerifyTypeEnum.CODE) {

        const today = Date.now(); // 

        const user = await User.findOne({ emailCode: code, emailCodeExpire: { $gte: today } });

        if (!user) {
            return next(new ErrorResponse('Error', 403, ['invalid activation token']))
        }

        user.isActivated = true;
        user.emailCode = undefined;
        user.emailCodeExpire = undefined;
        await user.save();

    }

    res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'successful',
        status: 200
    })

}

const sendTokenResponse = async (id: ObjectId, res: Response) => {

    let token: string = '', mapped: MapLoginResponseDTO | null = null;
    const user = await UserRepository.findById(id, true);

    if (user) {
        const roleIds = user.roles.map((x) => x._id);
        token = await AuthService.generateAuthToken({ id: user._id, email: user.email, roles: roleIds });
        mapped = await AuthMapper.mapLoginResponse(user);
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: mapped,
        token: token,
        message: 'successful',
        status: 200
    })

}