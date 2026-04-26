import Post from "../Models/post.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../Utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const imageLocalPath = req.file?.path;

    if (content.trim() === "" && !imageLocalPath) {
        throw new ApiError(400, "Post content or image is required!!");
    }

    let imageUrl = "";
    if (imageLocalPath) {
        const imageCloudUrl = await uploadToCloudinary(imageLocalPath)
        imageUrl = imageCloudUrl?.secure_url || "";
    }

    const post = await Post.create({
        content,
        image: imageUrl,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, true, "Post created successfully!!", post))
})

const getAllPosts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || ""

    const skip = (page - 1) * limit;

    const searchQuery = search ? {
        $or: [{
            content: { $regex: search, $options: "i" }
        }]
    } : {}
    
    const totalPosts = await Post.countDocuments(searchQuery)
    const posts = await Post.find(searchQuery).populate("owner", "username email avatar").sort({ createdAt: -1 }).skip(skip).limit(limit)

    return res.status(200).json(new ApiResponse(200, true, "Posts fetch successfully!!", {posts, pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalPosts/limit),
        totalPosts,
        hasNextPage: page < Math.ceil(totalPosts/limit),
        hasPrevPage: page > 1
    }}))
})

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("owner", "username email avatar");

    if (!post) {
        throw new ApiError(404, "Post not found with this id!!");
    }

    return res.status(200).json(new ApiResponse(200, true, "Post fetch successfully!!", post))
})

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id).populate("owner", "username email avatar");

    if (!post) {
        throw new ApiError(404, "Post not found with this id!!");
    }

    if (post.owner._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this post!!");
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { content }, { returnDocument: 'after' }).populate("owner", 'username email avatar');

    return res.status(200).json(new ApiResponse(200, true, "Post updated successfully!!", updatedPost))
})

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found with this id!!");
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post!!")
    }

    if (post.image) {
        await deleteFromCloudinary(post.image);
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, true, "Post deleted successfully!!", null))

})

const likePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id).populate("owner", "username email avatar");

    if (!post) {
        throw new ApiError(404, "Post not found with this id!!");
    }

    let likesArray = post.likes.map(like => like.toString());

    if (likesArray.includes(req.user._id.toString())) {
        post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString())
    } else {
        post.likes.push(req.user._id);
    }

    await post.save();

    return res.status(200).json(new ApiResponse(200, true, "Post like/unlike successfully!!", post))
})

export { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost }