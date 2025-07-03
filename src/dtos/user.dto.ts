import { UserType } from "../utils/types.util"

export interface CreateUserDTO{
    userType: UserType,
    email: string,
    password: string
}