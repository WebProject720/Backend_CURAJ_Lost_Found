import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { Reports } from "../../Models/model.js"

export const get = async (req, res) => {
    try {
        const reports = await Reports.aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userDetails",
                    pipeline: [
                        {
                            $project: {
                                email: 1,
                                username: 1,
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    userID: 0,
                }
            },
            { $sort: { createdAt: -1 } } 
        ]);

        return res.status(200).json(
            new ApiResponse('All reports', reports, true, 200)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError("Server failed ", error, false, 500)
        )
    }
}