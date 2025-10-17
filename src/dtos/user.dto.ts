import { UserType } from "../utils/types.utils";

export interface CreateUserDTO {
    firstName?: string,
    lastName?: string,
    userType: UserType,
    email: string,
    password: string,
}