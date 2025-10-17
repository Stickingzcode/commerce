import mongoose, { Schema, Model, ObjectId } from "mongoose";
import SystemService from "../services/system.service";
import { LoginMethodEnum } from "../utils/enums.utils";
import { IUserDoc } from "../utils/interfaces.utils";

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: [true, 'email already exists'],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minLength: [8, 'Password cannot be less than 8 characters'],
            select: false,
        },
        userType: {
            type: String,
            enum: [''],
            default: 'user',
        },
        isSuper: {
            type: Boolean,
            default: false,
        },
        isAdmin: {

        },
        isVendor: {

        },
        isCustomer: {

        },
        isUser: {

        },
        isActivated: {

        },
        isActive: {

        },
        isLocked: {

        },
        login: {
            last: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
            method: {
                type: String,
                enum: SystemService.enumToArray(LoginMethodEnum, 'values-only'),
                default: LoginMethodEnum.EMAIL,
            },
            limit: {
                type: Number,
                default: 0,
            }
        },
        slug: {
            type: String,
            default: '',
        },

        activationToken: String,
        activationTokenExpire: mongoose.Schema.Types.Mixed,

        emailCode: String,
        emailCodeExpire: mongoose.Schema.Types.Mixed,

        roles: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: 'Role'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc: any, ret) {
                ret._id = ret._id
            }
        }
    }
);

const User: Model<IUserDoc> = mongoose.model<IUserDoc>('User', UserSchema);

export default User;