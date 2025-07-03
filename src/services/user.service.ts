import { CreateUserDTO } from "../dtos/user.dto";

class UserService {

    constructor() { }


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
    public async createUser(data: CreateUserDTO): Promise<void>{

        const { email, password, userType } = data;

    }

}

export default new UserService()