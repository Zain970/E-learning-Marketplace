const { expressjwt } = require("express-jwt");
const User = require("../models/userModel");
const Course = require("../models/courseModel");

// Middleware :- gives req.user_id
const requireSignin = expressjwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});

const isInstructor = async (req, res, next) => {

    try {
        const user = await User.findById(req.auth._id);

        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        }
        else {
            next();
        }
    }
    catch (err) {
        console.log('Error : ', err);
    }
}

const isEnrolled = async (req, res, next) => {
    try {

        const user = await User.findById(req.auth._id).exec();
        const course = await Course.findOne({ slug: req.params.slug }).exec();

        // Check if course id is found in user courses array
        let ids = [];

        for (let i = 0; i < user.courses.length; i++) {
            ids.push(user.courses[i].toString());
        }

        if (!ids.includes(course._id.toString())) {
            res.sendStatus(403);
        }
        else {
            next();
        }

    }
    catch (error) {
        console.log("Error : ", error);
    }

}
module.exports = {
    requireSignin,
    isInstructor,
    isEnrolled
}