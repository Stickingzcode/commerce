import { Request, Response, NextFunction } from 'express'
import { RegisterDTO } from '../dtos/auth.dto';
import { UserTypeEnum } from '../utils/enums.util';

export const register = (req: Request, res: Response, next: NextFunction) => {

    const allowed: Array<string> = [UserTypeEnum.VENDOR, UserTypeEnum.CUSTOMER]

    const { email, password, userType } = <RegisterDTO>req.body;

    if(!userType){
        throw new Error('user type is required')
    }

    if(!allowed.includes(userType)){
        throw new Error(`invalid user type. choose from ${allowed.join(',')}`)
    }

    if(!email){
        throw new Error('email is required')
    }

    if(!password){
        throw new Error('password is required')
    }

    if(password.length < 8){
        throw new Error('password characters must not be less than 8')
    }
    
    // custom error class/function
    // validate email
    // validate the password
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