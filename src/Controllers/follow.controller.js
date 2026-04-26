import Follow from '../Models/follower.model.js'
import { ApiError } from '../Utils/ApiError.js'
import { ApiResponse } from '../Utils/ApiResponse.js'
import { asyncHandler } from '../Utils/asyncHandler.js'
import User from '../Models/user.model.js'

const followToggle = asyncHandler(async(req, res) => {
    const { id } = req.params;
    if(id === req.user._id.toString()){
        throw new ApiError(400, "You cannot follow your self!!")
    }

    const userToFollow = await User.findById(id)
    if(!userToFollow){
        throw new ApiError(404, "User not found with this id!!")
    }

    const existingUser = await Follow.findOne({
        follower: req.user._id,
        following: id
    })
    if(existingUser){
        await Follow.findByIdAndDelete(existingUser._id)
        return res.status(200).json(new ApiResponse(200, true, "Unfollow successfully!!"))
    }else{
        const follow = await Follow.create({
            follower: req.user._id,
            following: id
        })
    return res.status(200).json(new ApiResponse(200, true, "Follow successfully!!"))
    }
})

const getFollowing = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const user = await User.findById(id)
    if(!user){
        throw new ApiError(400, "User not found with this id!!")
    }

    const following = await Follow.find({ follower: id}).populate("following", "username email avatar")

    return res.status(200).json(new ApiResponse(200, true, "Following fetching", {following, totalFollowing: following.length}))
})

const getFollower = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if(!user){
        throw new ApiError(400, "User not found with this id!!")
    }


    const follower = await Follow.find({ following: id }).populate("follower", "username email avatar")
    return res.status(200).json(new ApiResponse(200, true, "Follower fetching !!", { totalFollower: follower.length, follower}))
})

export { followToggle, getFollowing, getFollower }