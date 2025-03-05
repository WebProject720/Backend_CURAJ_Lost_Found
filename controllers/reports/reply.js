import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Reports } from '../../Models/model.js'
import mongoose from "mongoose";
import { sendReply } from "../../utils/email.js";

export const reply = async (req, res) => {
    try {
        const { cid, reply } = req.body;
        if (!(cid && reply)) {
            return res.status(405).json(
                new ApiError("Complaint ID and Reply must filled", null)
            )
        }
        let complaint = await Reports.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(cid)
                }
            },
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
                $set: {
                    owner: { $arrayElemAt: ["$userDetails", 0] }
                }
            },
            {
                $project: {
                    owner: 1,
                    isOpen: 1,
                    title: 1,
                    description: 1
                }
            }
        ])
        if (complaint.length > 0) complaint = complaint[0];

        if (!complaint) {
            return res.status(405).json(
                new ApiError("Complaint not found", null)
            )
        }
        if (complaint.owner.email == req?.user?.email) {
            return res.status(405).json(
                new ApiError("Can't reply to yourself", null)
            )
        }
        if (!complaint.isOpen) {
            return res.status(406).json(
                new ApiError("Complaint now closed", null)
            )
        }
        const email = await sendReply(
            {
                description: complaint.description,
                username: complaint.owner.username,
                reply,
                email: complaint.owner.email,
                title: complaint.title,
                sender: req?.user?.email || ''
            }
        );

        if (!email.status) {
            return res.status(405).json(
                new ApiError("Mail not send", null)
            )
        }
        return res.status(200).json(
            new ApiResponse('Reply sended successfully', email, true, 200)
        )

    } catch (error) {
        console.log(error);
        return res.status(403).json(
            new ApiError("Forbidden: The server refuses to authorize the request.", error)
        )
    }
}