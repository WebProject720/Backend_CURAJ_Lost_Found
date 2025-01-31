import mongoose, { Schema } from "mongoose";

export const OtpSchema = new Schema({
    OTP: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const otp = new mongoose.model('otp', OtpSchema, 'otp');