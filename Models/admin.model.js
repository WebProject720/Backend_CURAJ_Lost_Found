import mongoose, { Schema } from "mongoose";


export const AdminSchema = new Schema(
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
        profileImage:{
            type:String,
            default:null
        }
    },
    { timestamps: true }
);



export const Admins = new mongoose.model('Admins', AdminSchema, 'Admins')