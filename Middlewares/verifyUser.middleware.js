import asyncHandler from "../Utils/asyncHandler";
import jwt from 'jsonwebtoken'
import User from '../Models/User'
import ApiError from "../Utils/ApiError";

const verifyUser = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")
    if (!token) throw new ApiError(401, "Unauthorized Request");

    const decodedToken = jwt.decode(token, JWT_ACCESS_SECRET);

    try {
        const user = User.findById(decodedToken?._id)

        if (!user) throw new ApiError(401, "Unauthorized Request");

        res.user = user;

        next();

    } catch (error) {
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."))
    }

});

export default verifyUser;