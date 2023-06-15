const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    picture: {
        type: String,
        default: "/avatar.png"
    },
    role: {
        type: [String],
        default: ["Subscriber"],
        enum: ["Subscriber", "Instructor", "Admin"]
    },
    stripe_account_id: {

    },
    stripe_seller: {

    },
    stripeSession: {

    },
    passwordResetCode: {
        type: String,
        default: ""
    }, courses: [
        { type: mongoose.ObjectId, ref: "Course" }
    ]
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;