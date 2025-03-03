import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { Reports } from "../../Models/model.js"

export const ChgStatus = async (req, res) => {
    try {
        const { id, changeTo } = req.body;
        const complain = await Reports.findOne({ _id: id });
        console.log(complain);
        if (!complain) {
            return res.status(304).json(
                new ApiError("Complain Not Found", '', false, 304)
            )
        }
        console.log(id);

        if (complain.userID != req?.user?._id) {
            return res.status(304).json(
                new ApiError("Access Denied", '', false, 304)
            )
        }
        const report = await Reports.findOneAndUpdate({ _id: id }, { isOpen: changeTo }, { new: true })
        console.log(report);

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