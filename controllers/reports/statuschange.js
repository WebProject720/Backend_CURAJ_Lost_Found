import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { Reports } from "../../Models/model.js"

export const ChgStatus = async (req, res) => {
    try {
        const { id } = req.body;
        const complain = await Reports.findOne({ _id: id });

        if (!complain) {
            return res.status(405).json(
                new ApiError("Complain Not Found", '', false, 304)
            )
        }
        
        if (!complain.isOpen) {
            return res.status(480).json(
                new ApiError("Can't Reopen Complaints", '', false, 304)
            )
        }

        if (complain.userID.toString() !== req.user._id.toString()) {
            return res.status(401).json(
                new ApiError("Access Denied", '', false, 405)
            )
        }
        const report = await Reports.findOneAndUpdate({ _id: id }, { isOpen: false }, { new: true })

        return res.status(200).json(
            new ApiResponse('All reports', report, true, 200)
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiError("Server failed ", error, false, 500)
        )
    }
}