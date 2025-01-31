import { otp, User } from "../../Models/model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'

export const verify = async (req, res) => {
    const CookieOptions = {
        httpOnly: true,     // Cookie accessible only by web server
        secure: true,       // Cookie sent only over HTTPS
        maxAge: 36000000,    // Cookie expiry time in milliseconds
        sameSite: 'strict', // Cookie sent only to the same site
        path: '/',
    }
    try {
        let { email, username, OTP } = req.body;

        if (!OTP) {
            return res.json(
                new ApiResponse('OTP required')
            )
        }
        if (!(email || username)) {
            return res.json(
                new ApiResponse('Identity required')
            )
        }
        if (!email?.includes("@curaj.ac.in")) {
            email = email.toLowerCase() + "@curaj.ac.in";
        }

        const doc = await otp.findOne({
            $or: [{ email }, { username }]
        });

        if (!doc) {
            return res
                .status(404)
                .json(
                    new ApiError('OTP expired')
                )
        }

        if (OTP == doc.OTP) {
            const user = await User.findOneAndUpdate(
                {
                    $or: [{ email }, { username }]
                }, { isVerified: true });
            if (!user) {
                return res.json(
                    new ApiResponse('User not Verified', null, null, 404)
                )
            }
            await otp.deleteOne({ _id: doc._id });
            const token = createToken({ _id: user._id, email: user.email });
            return res
                .cookie(process.env.TokenName, token, CookieOptions)
                .json(
                    new ApiResponse('User verified')
                )
        } else {
            return res
                .status(404)
                .json(
                    new ApiError('Invalid OTP')
                )
        }
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json(
                new ApiError('Server Error', error, false, 500)
            )
    }
}