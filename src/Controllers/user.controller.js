import bcrypt from 'bcrypt';
import User from '../Models/user.model.js';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary, deleteFromCloudinary } from '../Utils/cloudinary.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, fullname } = req.body;

    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, "All fields are required!!")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "username or email is already exist please add other!!")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let avatarUrl = "";
    let coverImageUrl = "";

    if (avatarLocalPath) {
        const avatarUploadResponse = await uploadToCloudinary(avatarLocalPath);
        avatarUrl = avatarUploadResponse?.secure_url || "";
    }

    if (coverImageLocalPath) {
        const coverImageUploadResponse = await uploadToCloudinary(coverImageLocalPath);
        coverImageUrl = coverImageUploadResponse?.secure_url || "";
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        fullname,
        password: hashPassword,
        avatar: avatarUrl,
        coverImage: coverImageUrl,
    })

    const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar || null,
        coverImage: user.coverImage || null,
    }

    return res.status(201).json(
        new ApiResponse(200, true, "User register successfully!!", userData)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User not found with this email or username!!")
    }

    const isPasswordValid = await user.isPasswordValid(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials!!")
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, true, "Login Successfully!!", { accessToken, userData })
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const isComingRefreshToken = req.cookies?.refreshToken;

    if (!isComingRefreshToken) {
        throw new ApiError(401, "Unauthorized!! No refresh token available!!")
    }

    const decoded = jwt.verify(isComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id)

    if (!user || user.refreshToken !== isComingRefreshToken) {
        throw new ApiError(401, "Unauthorized!! Invalid refresh token!!")
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, true, "Access token refreshed successfully!!",{ accessToken }));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { returnDocument: "after" })
    return res.status(200).clearCookie("refreshToken", cookieOptions).json(
        new ApiResponse(200, true, "Logout Successfully!!", null)
    )
})

const profileUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(404, "User not found!!")
    }
    return res.status(200).json(new ApiResponse(200, true, "User profile fetched successfully!!", user))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "No avatar image provided!!");
    }

    const user = await User.findById(req.user._id);

    if(user.avatar){
        await deleteFromCloudinary(user.avatar);
    }

    const avatarUploadResponse = await uploadToCloudinary(avatarLocalPath);
    const avatarUrl = avatarUploadResponse?.secure_url;
    if(!avatarUrl){
        throw new ApiError(500, "Failed to upload avatar image!!");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {avatar: avatarUrl}, { returnDocument: 'after' }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, true, "Avatar updated successfully!!", updatedUser))

})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "No cover image provided!!");
    }

    const user = await User.findById(req.user._id);
    if(user.coverImage){
        await deleteFromCloudinary(user.coverImage);
    }

    const coverImageUploadResponse = await uploadToCloudinary(coverImageLocalPath);
    const coverImageUrl = coverImageUploadResponse?.secure_url;

    if(!coverImageUrl){
        throw new ApiError(500, "Failed to upload cover image!!");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { coverImage: coverImageUrl }, { returnDocument: 'after' }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, true, "Cover image updated sucessfully!!", updatedUser))
})

const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if(!fullname && !email){
        throw new ApiError(400,"At Least one field is required to update!!")
    }

    const updatedData = {};
    if(fullname) updatedData.fullname = fullname;
    if(email) updatedData.email = email;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { returnDocument: 'after' }).select("-password -refreshToken")
    return res.status(200).json(new ApiResponse(200, true, "Profile updated successfully!!", updatedUser))
})

const changePassword = asyncHandler(async( req, res) => {
    const { currentPassword, newPassword } = req.body;

    if(!currentPassword || !newPassword){
        throw new ApiError(400, "Both current and new password are required!!");
    }

    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(404, "user not found!!");
    }
    const checkPassword = await user.isPasswordValid(currentPassword);

    if(!checkPassword){
        throw new ApiError(401, "Current password is incorrect!!");
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user._id, { password: hashNewPassword }, { returnDocument: 'after' });

    return res.status(200).json(new ApiResponse(200, true, "Password Changed successfully!!", null))
})

export { registerUser, loginUser, profileUser, refreshAccessToken, logoutUser, updateAvatar, updateCoverImage, updateProfile, changePassword };