import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { sendMail } from "../../utils/email.js";
import { Users } from '../../Models/users.model.js'

import bcrypt from 'bcrypt';
import 'dotenv/config'


export const register = async (req, res) => {
    try {
        let { enrollment, username, password } = req.body;

        let enroll = enrollment?.trim();
        username = username?.trim();
        password = password?.trim();
        const cookie = req?.cookies[process.env.TokenName];



        if (cookie) {
            return res.status(300).json(
                new ApiError('Session already running')
            )
        }
        if (!(enroll && username && password)) {
            return res
                .status(404)
                .json(new ApiError('All fields Required'));
        }
        enroll = enroll.toLowerCase() + '@curaj.ac.in';

        const existUser = await Users.findOne(
            {
                $or: [{ email: enroll }, { username: username }]
            }
        );
        if (existUser && !existUser?.isVerified) {
            await Users.deleteOne({ _id: existUser?._id });
        }

        if (existUser && existUser?.isVerified) {
            return res
                .status(404)
                .json(new ApiError('user already exits !!'))
        }
        const encodePass = await bcrypt.hash(password, 10);
        const newUser = await Users({
            username,
            email: enroll.toLowerCase(),
            password: encodePass
        })

        const EmailResponse = await sendMail(enroll);
        if (!EmailResponse.status) {
            return res
                .status(404)
                .json(new ApiError('Email not Send !! Try Again'));
        }
        const response = await newUser.save();


        return res
            .status(200)
            .json(new ApiResponse('user created successfully', response))
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }
}