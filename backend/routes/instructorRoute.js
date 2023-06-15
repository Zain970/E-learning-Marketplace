const express = require("express");

const router = express.Router();

const { requireSignin } = require("../middlewares");
const {
    makeInstructor,
    currentInstructor,
    studentCount,
    instructorCourses } = require("../controllers/instructorController");

router.route("/make-instructor").get(requireSignin, makeInstructor);
router.route("/current-instructor").get(requireSignin, currentInstructor);

router.route("/instructor-courses").get(requireSignin, instructorCourses);

router.route("/instructor/student-count").post(requireSignin, studentCount);

module.exports = router;
