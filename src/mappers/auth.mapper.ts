import { ObjectId } from "mongoose";
import { IRoleDoc, IUserDoc } from "../utils/interfaces.util";
import { MapLoginResponseDTO } from "../dtos/auth.dto";

class AuthMapper {

    constructor() { }

    /**
     * @name mapLoginResponse
     * @param user 
     * @returns 
     */
    public async mapLoginResponse(user: IUserDoc): Promise<MapLoginResponseDTO> {

        let result: MapLoginResponseDTO = {
            _id: user._id,
            id: user.id,
            email: user.email,
            userType: user.userType,
            isSuper: user.isSuper,
            isAdmin: user.isAdmin,
            isVendor: user.isVendor,
            isCustomer: user.isCustomer,
            isUser: user.isUser,
            roles: user.roles.map((x: IRoleDoc) => x.name)
        }

        return result;

    }

}

export default new AuthMapper()