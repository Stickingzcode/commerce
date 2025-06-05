import mongoose, { Schema, Model, ObjectId } from 'mongoose'
import { IUserDoc } from '../utils/interfaces.util';
import slugify from 'slugify';
import Role from './Role.model';

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
    this.slug = slugify(this.email, { lower: true });
    next();
})

UserSchema.methods.hasRole = async (name: string, roles: Array<ObjectId | any>): Promise<boolean> => {

    let flag: boolean = false;
    const _role = await Role.findOne({ name });

    if(_role){

        for(let i = 0; i < roles.length; i++){

            if(roles[i].toString() === _role._id.toString()){
                flag = true;
                break;
            } else {
                continue;
            }

        }

    }

    return flag;

}

// define the model
const User: Model<IUserDoc> = mongoose.model<IUserDoc>('User', UserSchema);

export default User;