import Comment from "../Models/comment.model.js";
import Post from "../Models/post.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const createComment = asyncHandler(async(req, res) =>{
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id).populate("owner", "username email avatar");

    if(!post){
        throw new ApiError(404, "Post not found with this id!!");
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required to create a comment!!");
    }

    const comment = await Comment.create({
        content,
        owner: req.user._id,
        post: id
    })

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json(new ApiResponse(201, true, "Comment created successfully!!", comment))
})

const getAllCommentsOfPost = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id).populate("owner", "username email avatar");

    if(!post){
        throw new ApiError(404, "Post not found with this id!!");
    }

    const comments = await Comment.find({ post: id }).populate("owner", "username email avatar").sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, true, "Comments fetch successfully!!", comments))
})

const deleteComment = asyncHandler(async(req, res) => {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId).populate("owner", "username email avatar");

    if(!post){
        throw new ApiError(404, "Post not found with this id!!");
    }

    const comment = await Comment.findById(commentId).populate("owner", "username email avatar");
    if(!comment){
        throw new ApiError(404, "Comment not found with this id!!")
    }

    if(comment.owner._id.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized for delete the comment!!")
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId)
    post.comments = post.comments.filter(comment => comment.toString() !== commentId)
    await post.save()


    return res.status(200).json(new ApiResponse(200, true, "Comment deleted successfully!!", null))
})

export { createComment, getAllCommentsOfPost, deleteComment }