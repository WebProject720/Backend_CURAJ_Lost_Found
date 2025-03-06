import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Reports, User } from '../../Models/model.js'


export const Add = async (req, res) => {
    try {
        const { uploadedImage } = req;
        const { title, description } = req.body;
        // console.log(uploadedImage);

        if (!(req.user || req.user._id)) {
            return res.status(401).json(
                new ApiError("unauthenrized user access", error, false, 401)
            )
        }


        if (!title || !description) {
            return res.status(300).json(
                new ApiError("Title and Description required", null, false, 401)
            )
        }
        let newReport;
        if (uploadedImage.hasImage && uploadedImage.success) {
            newReport = new Reports({
                userID: req.user._id,
                title,
                description,
                images: [uploadedImage.data.url],
                imgDetails: uploadedImage.data
            })
        } else {
            newReport = new Reports({
                userID: req.user._id,
                title,
                description
            })
        }

        const report = await newReport.save()

        await User.findOneAndUpdate({ _id: req.user._id }, { $push: { Reports: report } }, { new: true })

        return res.status(200).json(
            new ApiResponse('Report Added Successfully', report)
        )

    } catch (error) {
        console.log(error);
        return res.status(403).json(
            new ApiError("Forbidden: The server refuses to authorize the request.", error)
        )
    }
}