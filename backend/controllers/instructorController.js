const User = require("../models/userModel");
const Course = require("../models/courseModel");


const makeInstructor = async (req, res) => {

    try {
        const user = await User.findById(req.auth._id).exec();
        console.log("User : ", user);

        if (!user) {
            return res.status(400).send("No user found");
        }

        if (user.role.includes("Instructor")) {
            return res.status(400).send("Already a Instructor");
        }

        // Making the instructor
        user.role.push("Instructor");
        await user.save();

        user.password = undefined;

        res.json(user);
    }
    catch (error) {

        console.log("Error : ", error);
        return res.status(400).send("Error . Try again.")
    }
}

const currentInstructor = async (req, res) => {
    try {
        let user = await User.findById(req.auth._id).select("-password").exec();
        if (!user.role.includes("Instructor")) {
            return res.status(403).send("You are not a instructor");
        }
        else {
            res.json({ ok: true })
        }
    }
    catch (error) {
        console.log("Error : ", error);
        return res.status(400).send("Error . Try again.")
    }
}

const instructorCourses = async (req, res) => {
    console.log("user : ", req.auth._id);
    try {
        const courses = await Course.find({ instructor: req.auth._id }).sort({ createdAt: -1 }).exec();

        res.json(courses);
    }
    catch (err) {
        console.log("Error : ", err);
    }
}

const studentCount = async (req, res) => {
    try {

        // IF COURSE IF IS FOUND IN THE USER COURSEA ARRAY THEN 
        const courses = await User.find({ courses: req.body.courseId }).select("_id ").exec();
        res.json(courses);

    }
    catch (error) {
        console.log("Error : ", error);
    }

}
module.exports = {
    makeInstructor,
    currentInstructor,
    instructorCourses,
    studentCount
}