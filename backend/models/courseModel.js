const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 320,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    content: {
        type: {

        },
        minLength: 200,
    },
    video: {

    },
    free_preview: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 320,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: {

        },
        minLength: 200,
        required: true
    },
    price: {
        type: Number,
        default: 9.99
    },
    image: {

    },
    category: String,
    published: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: true
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    lessons: [lessonSchema]
}, { timestamps: true })

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;