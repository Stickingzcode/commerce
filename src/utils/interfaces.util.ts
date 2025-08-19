import { Document, ObjectId } from 'mongoose'

export interface ISGOptions{
    apiKey: string,
    to: string | Array<string>;
    from: string;
    subject: string;
    text: string;
    html: any;
    replyTo?: string
}

export interface INodemailer{
    send(data: ISGOptions, callback: CallableFunction): void
}

export interface IResult{
    error: boolean, 
    message: string, 
    code: number, 
    data: any
}

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
    userType: string,
    isSuper: boolean,
    isAdmin: boolean,
    isVendor: boolean,
    isCustomer: boolean,
    isUser: boolean,
    isActivated: boolean,
    isActive: boolean,
    isLocked: boolean,
    login: {
        last: Date | any,
        method: string,
        limit: number
    }
    slug: string,

    activationToken: string | undefined,
    activationTokenExpire: Date | any;

    emailCode: string | undefined,
    emailCodeExpire: Date | any

    roles: Array<ObjectId | any>

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;

    // functions
    hasRole(name: string, roles: Array<ObjectId | any>): Promise<boolean>
    matchPassword(password: string): Promise<boolean>,
    getActivationToken(): Promise<{ token: string, hash: string }>,
}