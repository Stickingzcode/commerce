import mongoose, { Schema, Model, ObjectId } from 'mongoose'
import { IUserDoc } from '../utils/interfaces.util';
import slugify from 'slugify';
import Role from './Role.model';
import bcrypt, { hash } from 'bcryptjs'

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            default: '',
        },

        lastName: {
            type: String,
            default: '',
        },

        email: {
            type: String,
            required: [true, 'email is required'],
            unique: [true, 'email already exists'],
        },

        password: {
            type: String,
            required: [true, 'password is required'],
            minlength: [8, 'Password cannot be less than 8 characters'],
            select: false,
        },

        userType: {
            type: String,
            enum: ['superadmin', 'admin', 'vendor', 'customer', 'user'],
            default: 'user',
        },

        isSuper: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isVendor: {
            type: Boolean,
            default: false
        },
        isCustomer: {
            type: Boolean,
            default: false
        },
        isUser: {
            type: Boolean,
            default: false
        },

        slug: {
            type: String,
            default: ''
        },

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
                ret.id = ret._id
            }
        }
    }
);

UserSchema.set('toJSON', { getters: true, virtuals: true });

UserSchema.pre<IUserDoc>('save', async function (next) {

    if (!this.isModified('password')) {
        return next()
    }

    this.slug = slugify(this.email, { lower: true });
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

UserSchema.methods.hasRole = async (name: string, roles: Array<ObjectId | any>): Promise<boolean> => {

    let flag: boolean = false;
    const _role = await Role.findOne({ name });

    if (_role) {

        for (let i = 0; i < roles.length; i++) {

            if (roles[i].toString() === _role._id.toString()) {
                flag = true;
                break;
            } else {
                continue;
            }

        }

    }

    return flag;

}

UserSchema.methods.matchPassword = async function (password: string) {

    let isMatched: boolean = false;

    if (this.password && this.password.toString() !== '') {
        isMatched = await bcrypt.compare(password, this.password);
    } else {
        isMatched = false;
    }

    return isMatched;

}

// define the model
const User: Model<IUserDoc> = mongoose.model<IUserDoc>('User', UserSchema);

export default User;