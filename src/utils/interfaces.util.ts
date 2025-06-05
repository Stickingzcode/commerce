import { Document, ObjectId } from 'mongoose'

export interface IRoleDoc extends Document {

    name: string,
    description: string,
    slug: string,

    users: Array<ObjectId | any>

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export interface IUserDoc extends Document {

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    slug: string

    roles: Array<ObjectId | any>

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;

    // functions
    hasRole(name: string, roles: Array<ObjectId | any>): Promise<boolean>
}