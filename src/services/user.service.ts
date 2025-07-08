import { CreateUserDTO } from "../dtos/user.dto";
import Role from "../models/Role.model";
import User from "../models/User.model";
import { UserTypeEnum } from "../utils/enums.util";
import { IRoleDoc, IUserDoc } from "../utils/interfaces.util";
import { UserType } from "../utils/types.util";

class UserService {

    constructor() { }


    /**
     * @name userExists
     * @param email 
     * @returns 
     */
    public async userExists(email: string): Promise<boolean> {

        const exUser = await User.findOne({ email: email });
        return exUser ? true : false;

    }


    /**
     * @name checkEmail
     * @param email 
     * @returns {Promise<boolean>} boolean
     */
    public async checkEmail(email: string): Promise<boolean> {

        const match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const isMatched = match.test(email);

        return isMatched;

    }


    /**
     * @name checkPassword
     * @param password 
     * @returns {Promise<boolean>} boolean
     */
    public async checkPassword(password: string): Promise<boolean> {

        const match = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        const isMatched = match.test(password);

        return isMatched;

    }

    /**
     * @name createUser
     * @description Creates a new user on the platform
     * @param {CreateUserDTO} data - see CreateUserDTO
     */
    public async createUser(data: CreateUserDTO): Promise<IUserDoc> {

        const { email, password, userType, firstName, lastName } = data;

        const exUser = await User.findOne({ email: email });

        if (exUser) {
            return exUser;
        } else {

            let user: IUserDoc = await User.create({
                email: email,
                password: password,
                userType: userType,
                firstName: firstName,
                lastName: lastName
            });

            // attach user role
            user = await this.attachRole(user, userType);

            return user;

        }

    }

    /**
     * 
     * @param user 
     * @param userType 
     * @returns 
     */
    public async attachRole(user: IUserDoc, userType: UserType): Promise<IUserDoc> {

        const userRole = await Role.findOne({ name: 'user' });
        const typeRole = await Role.findOne({ name: userType });

        if (userRole && typeRole) {

            user.roles.push(userRole._id);
            user.roles.push(typeRole._id);
            user.isUser = true;

            if (userType === UserTypeEnum.ADMIN) {
                user.isAdmin = true;
            }

            if (userType === UserTypeEnum.VENDOR) {
                user.isVendor = true;
            }

            if (userType === UserTypeEnum.CUSTOMER) {
                user.isCustomer = true;
            }

            await user.save();

        }

        return user;

    }

}

export default new UserService()