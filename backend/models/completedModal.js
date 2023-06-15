const mongoose = require("mongoose");

const completedSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    course: {
        type: mongoose.ObjectId,
        ref: "Course"
    },
    lessons: [],

}, { timestamps: true });

const completedModel = mongoose.model("Completed", completedSchema);

module.exports = completedModel;