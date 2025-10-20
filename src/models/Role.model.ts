import { timeStamp } from "console";
import { IRoleDoc } from "../utils/interfaces.utils";
import mongoose, { Schema, Model} from "mongoose";
import slugify from 'slugify';

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            unique: [true, 'role name already exists'],
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
        slug: {
            type: String,
            default: '',
        },
        users: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: 'User',
            }
        ]
    },
    {
        timestamp: true,
        versionKey: '_version',
        toJSON: {
            transform(doc: any, ret) {
                ret._id = ret._id
            }
        }
    }
);

RoleSchema.set('toJSON', { getters: true, virtuals: true});

RoleSchema.pre<IRoleDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true});
    next();
})

RoleSchema.methods.getAllRoles = async function name() {
    return await Role.find({})
}

const Role: Model<IRoleDoc> = mongoose.model<IRoleDoc>('Role', RoleSchema);

export default Role;