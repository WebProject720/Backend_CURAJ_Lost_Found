import mongoose, { Schema } from "mongoose";


export const UserSchema = new Schema(
    {
        username: {
            type: String,
            default: null
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        sessionKey: {
            type: String,
            default: null
        },
        Reports: {
            type: [Schema.Types.ObjectId],
            ref: "Reports",
        },
        profileImage: {
            type: String,
            default: null
        },
        imgDetails:{
            type:Object,
            required:false,
            default:null
        }
    },
    { timestamps: true }
);


export const Users = new mongoose.model('Users', UserSchema, 'Users')