import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '1d'
    });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d'
    });
}

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hashSync(this.password, 10);
    }

    next();
})



export const User = mongoose.model("User", userSchema);