import jsonwebtoken from "jsonwebtoken";
import { otp, User } from "../../Models/model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import 'dotenv/config'
import { CookieOption } from "../../utils/cookieOptions.js";

export const verify = async (req, res) => {
    const production = process.env.PRODUCTION == "true";
    const CookieOptions = CookieOption(production);
    
    try {
        let { email, username, OTP } = req.body;


        if (!OTP) {
            return res
                .status(404)
                .json(
                    new ApiError('OTP required', null, false)
                )
        }
        if (!(email || username)) {
            return res
                .status(404).json(
                    new ApiError('User ID not found')
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
                    new ApiError('OTP expired', null, false)
                )
        }

        if (OTP == doc.OTP) {
            const user = await User.findOneAndUpdate(
                {
                    $or: [{ email }, { username }]
                }, { isVerified: true });
            if (!user) {
                return res
                    .status(404)
                    .json(
                        new ApiError('User not Verified', null, false, 404)
                    )
            }
            await otp.deleteOne({ _id: doc._id });
            const token = jsonwebtoken.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
            return res
                .cookie(process.env.TokenName, token, CookieOptions)
                .status(200)
                .json(
                    new ApiResponse('User verified')
                )
        } else {
            return res
                .status(404)
                .json(
                    new ApiError('Invalid OTP', null, false)
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