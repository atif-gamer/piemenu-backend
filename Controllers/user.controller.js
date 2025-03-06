import asyncHandler from '../Utils/asyncHandler.js';
import ApiError from '../Utils/ApiError.js';
import User from '../Models/User.js';
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
        throw new ApiError(error.statusCode || 500).json(new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge."));
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

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) throw new ApiError(400, "Incorrect credentials");

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user.id);

        user.password = undefined;

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new ApiResponse(200, "User Registered Successfully", user))
    }
    catch (error) {
        console.log(error);
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.");
    }
})

const changePassword = asyncHandler(async (req, res) => {

    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    try {

        const dbUser = await User.findById(user?.id);

        if (!dbUser) throw new ApiError(403, "No user found");

        const isPasswordTrue = await dbUser.isPasswordCorrect(oldPassword)

        if (!isPasswordTrue) throw new ApiError(400, "Incorrect credentials");

        dbUser.password = newPassword;

        await dbUser.save({ validateBeforeSave: false });

        res.status(200).json(new ApiResponse(200, "User password changed Successfully", {}))

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.");
    }
})

const updateUser = asyncHandler(async (req, res) => {

    const user = req.user;
    const fieldsToUpdate = req.body;

    if (!Object.keys(fieldsToUpdate).length) throw new ApiError(403, "Nothing to update");

    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $set: { ...fieldsToUpdate }
        }, { new: true }).select("-password -refreshToken");

        if (!updatedUser) throw new ApiError(403, "No user found");

        res.status(200).json(new ApiResponse(200, "User details updated Successfully", updatedUser))

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Somthing Went Wronge.");
    }
})

// Forgot password

export { registerUser, changePassword, updateUser, loginUser }