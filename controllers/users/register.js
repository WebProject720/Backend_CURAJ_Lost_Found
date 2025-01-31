import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { sendMail } from "../../utils/email.js";
import { Users } from '../../Models/users.model.js'

import bcrypt from 'bcrypt';
import 'dotenv/config'


export const register = async (req, res) => {
    try {
        let { enrollment , username, password } = req.body;

        let enroll = enrollment?.trim();
        username = username?.trim();
        password = password?.trim();
        const cookie = req?.cookies[process.env.TokenName];

        
        console.log((enroll && username && password));
        

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
        enroll = enroll.toLowerCase() + '@curaj.ac.in'

        const existUserEmail = await Users.findOne({ enroll });
        if (existUserEmail) {
            return res
                .status(404)
                .json(new ApiError('enroll already in use'))
        }

        const exitUserUsername = await Users.findOne({ username });
        if (exitUserUsername) {
            return res
                .status(404)
                .json(new ApiError('Username already in use'))
        }
        const encodePass = await bcrypt.hash(password, 10);
        const newUser = await Users({
            username,
            email: enroll.toLowerCase(),
            password: encodePass
        })

        const EmailResponse = await sendMail(enroll);
        if (!EmailResponse.status) {
            console.log(EmailResponse);
            
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