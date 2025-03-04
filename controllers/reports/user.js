import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"
import { User } from "../../Models/model.js"
export const user = async (req, res) => {
    try {
        if (!(req?.user || req?.user?._id)) {
            return res.status(401).json(
                new ApiError("unauthenrized user access", error, false, 401)
            )
        }
        let complains = await User.aggregate(
            [
                {
                    $match: {
                        $or: [{ _id: req.user._id }]
                    }
                },
                {
                    $lookup: {
                        from: "Reports",
                        localField: "Reports",
                        foreignField: "_id",
                        as: "complains",
                        pipeline: [
                            { $sort: { createdAt: -1 } }
                        ]
                    }
                },
                {
                    $project: {
                        complains: 1
                    }
                }
            ]
        )

        if (!complains?.length) complains = false;
        else
            complains = complains[0];
        return res.status(200).json(
            new ApiResponse('Report Added Successfully', complains)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError("Server failed ", error, false, 500)
        )
    }
}