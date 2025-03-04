import asyncHandler from '../Utils/asyncHandler.js';
import ApiError from '../Utils/ApiError.js';
import User from '../Models/Users.js';
import ApiResponse from '../Utils/ApiResponse.js';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something Went Wronge");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            throw new ApiError(403, "User already exists with this email.");
        }

        // add tokens
        const newUser = await User.create({
            name,
            email,
            password
        });

        console.log(newUser.id);

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(newUser.id);

        await newUser.save({ validateBeforeSave: false });

        if (!newUser) throw new ApiError(403, "User already exists with this email.");

        res.status(200).json(new ApiResponse(200, "User Registered Successfully", {
            name,
            email,
            accessToken,
            refreshToken
        }))

    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."));
    }
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required.");
    }

    try {
        const user = await User.findOne({ email });

        if (!user) throw new ApiError(401, "No User is registered with the eamil")

        const isPasswordCorrect = user.isPasswordCorrect(password);

        if (!isPasswordCorrect) throw new ApiError(402, "Incorrect credentials");

        user.password = undefined;

        res.status(200).json(new ApiResponse(200, "User Registered Successfully", user))
    }
    catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."));
    }
})

// Forgot password

export { registerUser, loginUser }