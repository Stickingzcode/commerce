import User from "../models/User.model"
import { IUserDoc } from "../utils/interfaces.utils";
import { CreateUserDTO } from "../dtos/user.dto";
import Role from "../models/Role.model";
import { UserType } from "../utils/types.utils";
import { UserTypeEnum } from "../utils/enums.utils";
import Random from "../services/random.service";

class UserService {
    constructor() {

    }

    public async userExists(email: string): Promise<boolean> {
        const eUser = await User.findOne({ email: email });
        return eUser ? true : false;
    }

    public async checkEmail(email: string): Promise<boolean> {
        const match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isMatched = match.test(email);

        return isMatched;
    }

    public async create(data: CreateUserDTO): Promise<IUserDoc> {
        const { email, password, userType, firstName, lastName } = data;

        const eUser = await User.findOne({ email: email });

        if(eUser) {
            return eUser;
        } else {
            let user: IUserDoc = await User.create({
                email: email,
                password: password,
                userType: userType,
                firstName: firstName,
                lastName: lastName,
                isActive: true
            });

            user = await this.attachRole(user, userType);

            return user;
        }
        
    }

    public async attachRole(user: IUserDoc, userType: UserType): Promise<IUserDoc> {
        const userRole = await Role.findOne({ name: 'user'});
        const typeRole = await Role.findOne({ name: userType });

        if(userRole && typeRole) {
            user.roles.push(userRole._id);
            user.roles.push(typeRole._id);
            user.isUser = true;

            if(userType === UserTypeEnum.ADMIN) {
                user.isAdmin = true;
            }

            if(userType === UserTypeEnum.VENDOR) {
                user.isVendor = true;
            }

            if(userType === UserTypeEnum.CUSTOMER) {
                user.isCustomer = true;
            }

            await user.save();
        }

        return user;
    }

    public async generateOTP(id: Object): Promise<string> {
        let otp: string = '000000';
        const user = await User.findOne({ _id: id });

        if(user) {
            otp = Random.randomNum(6);
            user.emailCode = otp;
            user.emailCodeExpire = Date.now() + 10 * 60 * 1000;
            await user.save();
        }

        return otp;
    }

    public async checkPassword(password: string): Promise<boolean> {

        const match = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        const isMatched = match.test(password);

        return isMatched;

    }
}

export default new UserService();