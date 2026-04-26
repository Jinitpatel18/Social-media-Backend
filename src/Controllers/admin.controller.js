import User from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, true, "All users retrieved successfully!!", users)
    )

})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, " User not found with this id!!");
    }

    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You can't delete your own account!!");
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, true, "User deleted successfully!!", null)
    )
})

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found with this id!!");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { returnDocument: 'after' }).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, true, "User role updated successfully!!", updatedUser)
    )
})

export { getAllUsers, deleteUser, updateUserRole };