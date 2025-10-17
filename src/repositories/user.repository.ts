import { ObjectId, FilterQuery } from "mongoose";
import { IUserDoc } from "../utils/interfaces.utils";
import User from "../models/User.model";

class UserRepository{

    constructor(){}

    public async findById(id: ObjectId, populate: boolean = false): Promise<IUserDoc | null>{

        const datapop = [
            { path: 'roles', select: '_id name' }
        ]

        const pop = populate ? datapop : [];
        const query: FilterQuery<IUserDoc> = { _id: id };

        const user = await User.findOne(query).populate(pop);

        return user;

    }

    public async findByEmailSelectPassword(email: string, populate: boolean = false): Promise<IUserDoc | null>{

        const datapop = [
            { path: 'roles', select: '_id name' }
        ]

        const pop = populate ? datapop : [];
        const query: FilterQuery<IUserDoc> = { email: email };

        const user = await User.findOne(query).populate(pop).select('+password');

        return user;

    }

}

export default new UserRepository();