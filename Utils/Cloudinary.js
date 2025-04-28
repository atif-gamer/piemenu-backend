import cloudinary from 'cloudinary'

export const uploadImageToCloudinary = async (file) => {

    if (!file) return {
        error: 'No file is passed'
    }

    // upload image to cloudinary
    // Convert the buffer to a data URI
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: 'cards',
        resource_type: 'image',
    });

    return uploadResponse;
}
export const deleteImgFromCloudinary = async (url) => {
    // Delete image from cloudinary
    let publicId = null;

    if (url) {
        // Extract the public_id from a URL like:
        // https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/cards/image123.jpg
        // The public_id would be: "cards/image123"
        const urlParts = url.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const filename = filenameWithExtension.split('.')[0];
        publicId = `${filename}`;
    }
    else {
        return {
            success: false,
            response: {
                error: "Incorrent Url"
            }
        }
    }

    // 4. If we have a public_id, delete the old image
    if (publicId) {
        try {
            const response = await cloudinary.uploader.destroy(publicId);

            return {
                success: response?.result === 'ok',
                response
            }
        } catch (deleteErr) {
            // Continue even if delete fails
            return {
                success: false,
                response
            }
        }
    }
    else {
        return {
            success: false,
            response: {
                error: "Incorrent Image Public Id"
            }
        }
    }
}
