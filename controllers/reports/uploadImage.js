import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponse.js"


export const ImageUpload = async (req, res) => {
    try {
        const { uploadedImage } = req;
        if (uploadedImage.hasImage && !uploadedImage.success) {
            return res.status(406).json(
                new ApiResponse('Try again', null, true, 200)
            )
        }
        if (uploadedImage.hasImage && uploadedImage.success) {
            return res.status(200).json(
                new ApiResponse('Image Uploaded', uploadedImage.data, true, 200)
            )
        }
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server error', error, false)
        )
    }
}