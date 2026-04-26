import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
},{
    timestamps: true
})

const Comment = model("Comment", commentSchema)
export default Comment;