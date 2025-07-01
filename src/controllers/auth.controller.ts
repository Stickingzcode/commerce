import { Request, Response, NextFunction } from 'express'
import { RegisterDTO } from '../dtos/auth.dto';
import { UserTypeEnum } from '../utils/enums.util';
import AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password, userType } = <RegisterDTO>req.body;

    const validate = await AuthService.validateRegister(req.body);

    if(validate.error){
        
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