const express = require("express");
const router = express.Router();

const { requireSignin, isInstructor, isEnrolled } = require("../middlewares/index");
const formidable = require("express-formidable");
const {
    uploadImage,
    removeImage,
    createCourse,
    getCourseData,
    videoUpload,
    removeVideo,
    addLesson,
    updateCourse,
    publishCourse,
    unpublishCourse,
    getAllCourses,
    getCompletedLessons,
    checkEnrollment,
    freeEnrollment,
    updateLesson,
    userCourses,
    markIncomplete,
    markCompleted,
    stripeController,
    deleteLesson } = require("../controllers/courseController");

// THIS RETURNS ALL THE COURSE
router.route("/courses").get(getAllCourses);
// IMAGE ROUTES --------------------
router.route("/course/upload-image").post(uploadImage);
router.route("/course/remove-image").post(removeImage);
// CREATE A NEW COURSE
router.post("/course", requireSignin, isInstructor, createCourse);

// GET DATA OF A SPECIFIC COURSE
router.route("/course/:slug").get(requireSignin, getCourseData);

// UPDATE THE COURSE
router.put("/course/:slug", requireSignin, updateCourse)

// VIDEO ROUTES ---------------------
router.route("/course/video-upload/:instructorId").post(requireSignin, formidable(), videoUpload);
router.route("/course/video-remove/:instructorId").post(requireSignin, removeVideo)

// Publish and Unpublish
router.route("/course/publish/:courseId").put(requireSignin, publishCourse);
router.route("/course/unpublish/:courseId").put(requireSignin, unpublishCourse);

router.route("/course/lesson/:slug/:instructorId").post(requireSignin, addLesson);
router.route("/course/lesson/:slug/:instructorId").put(requireSignin, updateLesson);

router.route("/course/:slug/:lessonId").put(requireSignin, deleteLesson);

// ENROLLMENT
router.route("/check-enrollment/:courseId").get(requireSignin, checkEnrollment);

// Enrollment in a particualar course
router.route("/free-enrollment/:courseId").post(requireSignin, freeEnrollment);


router.route("/user-courses").get(requireSignin, userCourses);

router.route("/user/course/:slug").get(requireSignin, isEnrolled, getCourseData);


// MARK AS COMPLETED
router.route("/mark-completed").post(requireSignin, markCompleted);

// GET ALL THE COMPLETED LESSONS
router.route("/list-completed").post(requireSignin, getCompletedLessons);


// MARK THE LESSON AS COMPLETED
router.route("/mark-incomplete").post(requireSignin, markIncomplete);

router.route("/stripe").post(stripeController);



module.exports = router;