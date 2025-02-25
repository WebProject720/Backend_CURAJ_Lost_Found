import { User } from "../Models/model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import 'dotenv/config'
import jsonwebtoken from 'jsonwebtoken'


export const authenticateUser = async (req, res, next) => {
    try {
        const TokenName = process.env.TokenName || 'Token';
        const cookie = req?.cookies[TokenName];

        if (!cookie) {
            return res.status(401).json(
                new ApiError('Unauthorized: Authentication is required or has failed.', null, false, 401)
            )
        }

        const userDetails = jsonwebtoken.verify(cookie, process.env.JWT_SECRET_KEY)



        if (!userDetails)
            return res.status(401).json(
                new ApiError('Incorrect User Token'))
        const user = await User.findOne({ _id: userDetails._id || null });
        if (!user) {
            return res.status(400).json(
                new ApiError('User not found', null, false, 400)
            )
        }
        req.user = user;

        next();
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError('Internal Server Error: The server encountered an unexpected condition.', error, false, 401)
        )
    }
}