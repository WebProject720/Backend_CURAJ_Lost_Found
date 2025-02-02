import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Users } from '../../Models/users.model.js'
import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';

export const getUser = async (req, res) => {
    try {
        const TokenName = process.env.TokenName || 'Token';
        const cookie = req?.cookies[TokenName];

        if (!cookie) {
            return res.status(300).json(
                new ApiError('Please Login !!')
            )
        }
        const { _id, email } = jsonwebtoken.verify(cookie, process.env.JWT_SECRET_KEY);
        const user = await Users.findOne(
            {
                $or: [{ email }, { _id }]
            }
        ).select("-password -Reports");

        return res.status(200).json(
            new ApiResponse("User Details", user, true)
        )

    } catch (error) {
        console.log(error);
        return res.status(404).json(
            new ApiError('Server Error')
        )
    }
}