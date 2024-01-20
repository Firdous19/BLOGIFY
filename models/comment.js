const { Schema, model, default: mongoose } = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },

    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog"
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

const Comment = model("comment", commentSchema);

module.exports = Comment;