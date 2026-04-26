import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

const Post = model("Post", postSchema)
export default Post;