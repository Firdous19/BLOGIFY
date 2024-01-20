const { Schema, model, default: mongoose } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    coverImageURL: {
        type: String,
        required: false
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

const blogModel = new model("blog", blogSchema)

module.exports = blogModel;