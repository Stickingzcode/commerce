import {Request, Response, NextFunction } from 'express';
import { VerifyTypeEnum, LoginMethodEnum } from '../utils/enums.utils';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import ErrorResponse from '../utils/error.util';
import { UserType } from '../utils/types.utils';
import { RegisterDTO, LoginDTO, MapLoginResponseDTO } from '../dtos/auth.dto';
import UserRepository from "../repositories/user.repository";
import { ObjectId } from "mongoose";
import AuthMapper from '../mappers/auth.mapper';

declare global {
    namespace Express {
        interface Request {
            language?: string;
            channel?: string;
        }
    }
}

export const register = async(req: Request, res: Response, next: NextFunction) => {
    const { email, password, userType, callbackurl, verifyType } = <RegisterDTO>req.body;

    const validate = await AuthService.validateRegister(req.body);

    if(validate.error) {
        return next(new ErrorResponse('error', validate.code, [`${validate.message}`]))
    }

    const exists = await UserService.userExists(email);
    if(exists) {
        return next(new ErrorResponse('error', 422, ['email already exists']))
    }

    const passwordMatch = await UserService.checkPassword(password);
    if(!passwordMatch) {
        //I need to write the password regex thingy.
        // return next(new ErrorResponse('error', 400, [`invalid password! ${PASSWORD_REGXP_ERROR}`]));
    }

    const user = await UserService.create({
        email: email,
        password: password,
        userType: userType as UserType,
        firstName: `New ${userType}`,
        lastName: 'User'
    });

    if(verifyType === VerifyTypeEnum.TOKEN) {

    }

    if(verifyType === VerifyTypeEnum.CODE) {

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
        message: 'user created successfully',
        status: 200
    });
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