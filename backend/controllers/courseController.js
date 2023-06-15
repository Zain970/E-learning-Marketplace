const AWS = require("aws-sdk");
const Course = require("../models/courseModel");
const slugify = require("slugify");
const fs = require("fs");
const User = require("../models/userModel");
const Completed = require("../models/completedModal");

// To give unique name to each upload image so that no conflict
const { nanoid } = require("nanoid");

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
};

const S3 = new AWS.S3(awsConfig)


// We are getting the image from the frontend as a binary data
const uploadImage = (req, res) => {
    try {
        // 1).Getting image from the body
        let { image } = req.body;

        // 2).If image not provided
        if (!image) {
            return res.status(400).send("No Image")
        }

        // Prepare the image
        // 3).We want to remove(replace) the first few characters from the image
        // Converting the image to the buffer
        const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64")

        // Randomly generated name to the image
        const imageType = image.split(";")[0].split("/")[1];
        const imageName = `${nanoid()}.${imageType}`

        console.log("Type : ", imageType);
        console.log("Image Name ", imageName);

        // Image Params
        const params = {
            Bucket: "web-programming-project",
            Key: imageName,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${imageType}`
        }

        S3.upload(params, (err, data) => {
            if (err) {
                console.log('Error : ', err);
                return res.sendStatus(400);
            }
            console.log('Data : ', data);
            res.send(data);
        })
    }
    catch (error) {
        console.log("Error : ", error);
    }
}

// The image uploaded by the user now removing it if he wants to remove
const removeImage = (req, res) => {
    try {
        const { image } = req.body;
        console.log("Image : ", image);
        // Image params
        const params = {
            Bucket: image.Bucket,
            Key: image.Key
        };

        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log("Error : ", err)
            }
            res.send({ ok: true })
        })
    }
    catch (err) {
        console.log('Error : ', err);
    }
}

// REACT COURSE FOR BEGINNERS
// slug :- react-course-for-beginners
const createCourse = async (req, res) => {
    try {

        // Check if the course with that slug already exists
        const alreadyExists = await Course.findOne({
            slug: slugify(req.body.name.toLowerCase())
        });

        // IF THE COURSE WITH THAT TITLE ALREADY EXISTS SEND THE ERROR
        if (alreadyExists) {
            return res.status(400).send("Title is taken");
        }

        // NOW CREATING THE COURSE
        const course = await new Course({
            slug: slugify(req.body.name),
            instructor: req.auth._id,
            ...req.body
        }).save();

        // SENDING BACK THE NEW CREATED COURSE
        res.json(course);
    }
    catch (err) {
        console.log('Error : ', err);
        return res.status(400).send("Course create failed.Try again");
    }
}
const getCourseData = async (req, res) => {

    console.log("Get single course data----------------- : ");

    try {

        const { slug } = req.params;

        console.log("Slug : ", slug);
        const course = await Course.findOne({ slug: req.params.slug }).populate("instructor", "_id name").exec();
        console.log('Course : ', course);
        res.json(course);
    }
    catch (err) {
        console.log("Error : ", err);
        return res.status(401).send('Unauthorized');
    }
}

const videoUpload = async (req, res) => {

    try {

        // If the currently logged in user and the instructor id matched then Ok

        if (req.auth._id != req.params.instructorId) {
            return res.status(400).send("Unauthorzied");
        }

        // Because of the formidable we are able to access it

        const { video } = req.files;

        console.log("Video : ", video);
        // If no video found
        if (!video) {
            return res.status(400).send("No Video");
        }

        const videoName = `${nanoid()}.${video.type.split("/")[1]}`;
        console.log("Video Name : ", videoName);

        // Params for uploading to the s3
        const params = {
            Bucket: "web-programming-project",
            Key: `${videoName}`,                          // video/mp4
            Body: fs.readFileSync(video.path),
            ACL: "public-read",
            ContentType: video.type
        }

        // Upload to the S3
        S3.upload(params, (err, data) => {
            if (err) {
                console.log("Error : ", err);
                res.sendStatus(400);
            }
            console.log("Data got from s3 after uploading video : ", data);
            res.send(data);
        })
    }
    catch (err) {
        console.log("Error : ", err);
    }
}
const removeVideo = (req, res) => {

    try {

        if (req.auth._id != req.params.instructorId) {
            return res.status(400).send("Unauthorzied");
        }

        // Because of the formidable we are able to access it
        const { Bucket, Key } = req.body;

        // Params for uploading to the s3
        const params = {
            Bucket,
            Key
        }

        // Upload to the S3
        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log("Error : ", err);
                res.sendStatus(400);
            }
            console.log("Data got from s3 after removing video : ", data);
            res.send({ ok: true })
        })
    }
    catch (err) {
        console.log("Error : ", err);
    }
}

const addLesson = async (req, res) => {

    try {
        const { slug, instructorId } = req.params;
        const { title, content, video } = req.body;

        // 1).If the currently logged in user and the instructor id does not match
        if (req.auth._id != instructorId) {
            return res.status(400).send("Unauthorzied");
        }

        // 2).Pushing the lessons to the lesson array in the course schema
        const updated = await Course.findOneAndUpdate({ slug }, {
            $push: { lessons: { title, content, video, slug: slugify(title) } }
        }, { new: true }
        ).populate("instructor", "_id name")

        res.json(updated);

    }
    catch (err) {
        console.log('Error : ', err);
        return res.status(400).send("Add lesson failed");
    }
}

const updateCourse = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({ slug }).exec();


        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorzied");
        }

        const updated = await Course.findOneAndUpdate({ slug }, req.body, {
            new: true
        }).exec();

        res.json(updated);
    }
    catch (err) {
        console.log("Error : ", err);
        return res.status(400).send(err.message)
    }
}
const deleteLesson = async (req, res) => {

    try {
        // Finding the course whose lesson you want to delete
        const { slug, lessonId } = req.params;
        const course = await Course.findOne({ slug })

        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }

        // UPDATE BECAUSE WE WANT TO PULL THE LESSON OUT FROM THE COURSE.LESSON ARRAY
        const deletedCourse = await Course.findByIdAndUpdate(course._id, {
            $pull: { lessons: { _id: lessonId } }
        }).exec();

        res.json({ ok: true });
    }
    catch (error) {

    }
}

const publishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId).select("instructor").exec();

        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }
        // Now pubishing the course 
        const updated = await Course.findByIdAndUpdate(
            courseId,
            { published: true },
            { new: true }
        ).exec();

        // Sending the course back after publishing it
        res.json(updated);

    }
    catch (error) {
        console.log("Error : ", error);
        return res.status(400).send("Publish course failed");
    }
}

const unpublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId).select("instructor").exec();

        if (req.auth._id != course.instructor) {
            return res.status(400).send("Unauthorized");
        }

        // Now Unpublishing the course 
        const updated = await Course.findByIdAndUpdate(
            courseId,
            { published: false },
            { new: true }
        ).exec();

        // Sending the course back after Unpublishing it
        res.json(updated);
    }
    catch (error) {
        console.log('Error : ', error);
        return res.status(400).send("Unpublish course failed");
    }
}

const getAllCourses = async (req, res) => {
    try {
        const allPublishedCourses = await Course.find({ published: true }).populate("instructor", "_id name").exec();
        res.json(allPublishedCourses);
    }
    catch (error) {
        console.log('Error : ', error);
        return res.status(400).send("Fetching courses failed");
    }
}

const updateLesson = async (req, res) => {
    try {
        const { slug } = req.params;

        const { _id, title, content, video, free_preview } = req.body;
        console.log("req.body : ", req.body);
        console.log("Slug : ", slug);

        const course = await Course.findOne({ slug }).select("instructor").exec();

        if (course.instructor._id != req.auth._id) {
            return res.status(400).send("Unauthorized");
        }

        const updatedLesson = await Course.updateOne({ "lessons._id": _id }, {
            $set: {
                "lessons.$.title": title,
                "lessons.$.content": content,
                "lessons.$.video": video,
                "lessons.$.free_preview": free_preview
            },
        },
            { new: true }
        ).exec();
        console.log("Updated Lesson : ", updateLesson);

        res.json({ ok: true })
    }
    catch (error) {

        return res.status(400).send("Update Lesson Failed");
    }
}

const checkEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find courses of currently logged in user
        const user = await User.findById(req.auth._id).exec();

        // Check if course id is found in user courses array
        let ids = [];

        let length = user.courses && user.courses.length;

        // Get all the courses of this user
        for (let i = 0; i < length; i++) {
            ids.push(user.courses[i].toString());
        }

        console.log("Ids : ", ids);

        res.json({
            status: ids.includes(courseId),
            course: await Course.findById(courseId).exec()
        })

    }
    catch (error) {
        console.log("Error : ", error);
    }
}

const freeEnrollment = async (req, res) => {

    try {
        const course = await Course.findById(req.params.courseId).exec();

        // if (course.paid) {
        //     return;
        // }

        const result = await User.findByIdAndUpdate(req.auth._id, {
            $addToSet: { courses: course._id }

        }, { new: true }).exec();


        res.json({
            message: "Congratulation ! You have successfully enrolled! ",
            course
        })
    }
    catch (error) {
        console.log("Free Enrollment Error : ", err);
        return res.status(400).send("Enrollment create failed");
    }
}

const userCourses = async (req, res) => {

    const user = await User.findById(req.auth._id).exec();

    console.log("User.courses : ", user.courses);

    // Get all the course in which the user is enrolled (user.courses)
    const courses = await Course.find({ _id: { $in: user.courses } }).populate("instructor", "_id name").exec();
    console.log("Courses : ", courses);

    res.json(courses);
}

const markCompleted = async (req, res) => {

    const { courseId, lessonId } = req.body;

    // Find if user with that course is already completed
    const existing = await Completed.findOne({
        user: req.auth._id,
        course: courseId
    }).exec();

    console.log("EXISTING : ", existing);
    if (existing) {
        // update 
        const updated = await Completed.findOneAndUpdate(
            {
                user: req.auth._id,
                course: courseId
            },
            {
                $addToSet: { lessons: lessonId }
            }
        ).exec();
        console.log("Updated : ", updated);
        res.json({ ok: true })
    }
    else {

        const created = await new Completed({
            user: req.auth._id,
            course: courseId,
            lessons: lessonId
        }).save();

        res.json({ ok: true });
    }
}

const getCompletedLessons = async (req, res) => {

    try {
        const list = await Completed.findOne({
            user: req.auth._id,
            course: req.body.courseId
        }).exec()

        list && res.json(list.lessons);
    }
    catch (error) {
        console.log('Error : ', error);
        return res.status(400).send("Error getting completed lesson");
    }
}

const markIncomplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;
        const updated = await Completed.findOneAndUpdate({
            user: req.auth._id,
            course: courseId
        }, {
            $pull: { lessons: lessonId }
        }).exec()

        res.json({ ok: true });
    }
    catch (error) {
        console.log("Error :", error);
    }

}

const stripeController = async (req, res) => {
    const { purchase, total_amount, tax } = req.body;

    const calculateOrderAmount = () => {
        return total_amount + tax

    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: "usd"
    })

    res.json({
        clientSecret: paymentIntent.clientSecret
    })

}
module.exports = {
    uploadImage,
    removeImage,
    createCourse,
    getCourseData,
    videoUpload,
    removeVideo,
    addLesson,
    updateCourse,
    deleteLesson,
    publishCourse,
    unpublishCourse,
    getAllCourses,
    stripeController,
    updateLesson,
    checkEnrollment,
    freeEnrollment,
    userCourses,
    markCompleted,
    markIncomplete,
    getCompletedLessons
}