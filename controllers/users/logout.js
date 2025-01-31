import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import 'dotenv/config'
import { CookieOption } from "../../utils/cookieOptions.js";
import jsonwebtoken from "jsonwebtoken";

export const logout = async (req, res) => {
    try {
        const { _id } = req.body || {};
        const production = process.env.PRODUCTION == "true";
        const CookieOptions = CookieOption(production, true);
        const TokenName = process.env.TokenName || 'Token';
        const cookie = req?.cookies[TokenName];


        if (!_id && cookie) {
            return res.status(400).json(
                new ApiError('Session not found')
            )
        }


        const user = jsonwebtoken.verify(cookie, process.env.JWT_SECRET_KEY);
        if (user._id != _id) {
            return res.status(400).json(
                new ApiError('User session ID not matched !')
            )
        }

        return res
            .status(200)
            .clearCookie(process.env.TokenName, CookieOptions)
            .json(
                new ApiResponse('user logout')
            )

    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError('Server Error')
        )
    }
}