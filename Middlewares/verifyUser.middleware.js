import asyncHandler from "../Utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from '../Models/User.js'
import ApiError from "../Utils/ApiError.js";

const verifyUser = asyncHandler(async (req, res, next) => {

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log(accessToken);
    if (!accessToken) throw new ApiError(401, "Unauthorized Request");

    const decodedToken = jwt.decode(accessToken, process.env.JWT_ACCESS_SECRET);

    try {
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) throw new ApiError(401, "Unauthorized Request");

        req.user = user;

        next();

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.")
    }
});

export default verifyUser;