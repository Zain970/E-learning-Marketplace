import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

// OUTSIDE LIBRARIES
import {
    Avatar,
    Tooltip,
    Button,
    Modal,
    List,
    Item
} from 'antd'
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import {
    EditOutlined,
    CheckOutlined,
    UploadOutlined,
    CloseOutlined,
    QuestionOutlined,
    UserSwitchOutlined
} from "@ant-design/icons"

// COMPONENTS
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import AddLessonForm from '../../../../components/forms/AddLessonForm'

function CourseView() {

    // The course which is fetched is set to this state variable
    const [course, setCourse] = useState({});
    // Uoloading State variable , 
    const [uploading, setUploading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
    const [progress, setProgress] = useState(0);

    // Student Count
    const [students, setStudents] = useState(0);

    // Modal for uploading a lesson
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: "",
        content: "",
        video: ""
    })
    const router = useRouter();

    // Dynamic slug value
    const { slug } = router.query;

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        console.log('Course from backend : ', data);
        setCourse(data);
    }
    useEffect(() => {
        loadCourse();
    }, [slug])

    const studentCount = async (e) => {
        const { data } = await axios.post("/api/instructor/student-count", {
            courseId: course._id
        })

        console.log("STUDENT COUNT => ", data);
        setStudents(data.length);

    }

    useEffect(() => {

        // To fetch number of students enrolled in the course
        course && studentCount()
    }, [course])

    const handleVideo = async (event) => {
        try {
            // 1).File contains the video which is being uploaded
            const file = event.target.files[0];

            // 1),Assigning file name to the UploadButtonText state variable
            setUploadButtonText(file.name);

            // 1).During the uploading we set the uploading to be true
            // 2).So on the next child component when it is true , the button is disabled by default
            setUploading(true);

            // 1).Send the video file to the backend so the backend can upload the video to the Aws
            // 2).We have to send the video as the form data to the backend
            // 3).Save progress bar and send video as form data to the backend
            const videoData = new FormData();
            videoData.append("video", file);

            const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress: (event) => {
                    const { loaded, total } = event;
                    setProgress(Math.round((100 * loaded) / total))
                }
            })

            // 1).The response from the backend will be the location where the video is uploaded and the keys
            // 2).If we want to remove the video in the future
            // 3).Set the state variable of the video equal to the data recieved from the backend
            console.log("Data : ", data);
            setValues({ ...values, video: data });

            // 1).SET LOADING STATE TO BE FALSE
            setUploading(false);

        }
        catch (err) {
            console.log('Error : ', err);
            setUploading(false);
            toast.error("Video upload failed");
        }
    }

    const handleVideoRemove = async () => {
        try {

            // 1).SET UPLOADING TO BE TRUE BECAUSE WE ARE MAKING REQUEST AT BACKEND TO REMOVE THE VIDEO
            setUploading(true);

            // 2).SENDING THE REQUEST TO THE BACKEND TO REMOVE THE VIDEO FROM THE S3
            // 3).values.video is an object 
            const { data } = await axios.post(`/api/course/video-remove/${course.instructor._id}`, values.video);

            console.log("Data : ", data);

            setValues({ ...values, video: {} })
            setUploading(false);
            setUploadButtonText("Upload another video");

        }
        catch (error) {
            console.log("Error : ", error);
            setUploading(false);
            toast("Video remove failed");
        }
    }

    // ADDING A NEW LESSON
    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {

            // 1).MAKING THE REQUEST TO THE BACKEND TO ADD THE NEW LESSON
            // 2).Sending the instructor id and the course slug along with it
            const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, values)

            setValues({ ...values, title: "", content: "", video: {} });
            setVisible(false);
            setUploadButtonText("Upload Video");

            console.log("Data from backend after uploading lesson : ", data);

            setCourse(data);
            toast('Lesson Added')
        }
        catch (error) {
            console.log("Error : ", error);
            toast.error("Lesson add failed");
        }
    }

    const handlePublish = async (e, courseId) => {
        try {
            let answer = window.confirm("Once you publish the course it will be live in the marketplace for users to enroll.");

            if (!answer) {
                return
            }

            // Sending the request to the backend to publish the course
            const { data } = await axios.put(`/api/course/publish/${courseId}`);
            setCourse(data);

            toast("Congrats ! Your course is now live")
        }
        catch (error) {
            toast("Course published failed.Try again");
        }
    }
    const handleUnpublish = async (e, courseId) => {
        try {
            let answer = window.confirm("Once you unpublish your course it will not be availabe for users to enroll");

            if (!answer) {
                return;
            }


            // Sending the request to the backend to unpublish the course
            const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
            setCourse(data);

            toast("Your course is now unpublished")
        }
        catch (error) {
            toast("Course published failed.Try again");
        }
    }

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
                {
                    course && (
                        <div className='container-fluid pt-1'>
                            <div className="media pt-2">

                                {/* -------- IMAGE OF THE COURSE --------- */}
                                <Avatar
                                    size={100}
                                    src={course.image ? course.image.Location : "/course.png"}
                                />

                                {/* ------- COURSE DETAILS SUCH AS NAME , LESSONS , PRICE  -------- */}
                                <div className="media-body pl-2 courseDetail">
                                    <div className="row">
                                        <div className="col">
                                            <h5 className="mt-2 text-primary">
                                                {course.name}
                                            </h5>
                                            <p style={{ marginTop: "-10px" }}>
                                                {course.lessons && course.lessons.length} Lessons
                                            </p>
                                            <p style={{ marginTop: "-15px", fontSize: "18px" }}>
                                                {course.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ( EDIT AND Publish SIGN ) INFRONT OF THE COURSE DETAILS */}
                                {/* WHEN THE USER CLICKS ON THE EDIT BUTTON WE HAVE TO EDIT THE COURSE */}
                                <div className="display-flex courseIcon">

                                    <Tooltip title={`${students} Enrolled `} className='change'>
                                        <UserSwitchOutlined
                                            className='h5 pointer text-info mr-4' />

                                    </Tooltip>


                                    {/*------------ EDIT ICON -------- */}
                                    <Tooltip title="Edit" className='change'>
                                        <EditOutlined
                                            onClick={() => {
                                                router.push(`/instructor/course/edit/${slug}`)
                                            }}
                                            className='h5 pointer text-warning mr-4' />

                                    </Tooltip>

                                    {
                                        course.lessons && course.lessons.length < 5 ? (
                                            <Tooltip title="Min 5 lessons required to publish">
                                                <QuestionOutlined className='h5 pointer text-danger' />
                                            </Tooltip>
                                        ) :
                                            course.published ? (
                                                <Tooltip title="Unpublish" onClick={(e) => { handleUnpublish(e, course._id) }}>
                                                    <CloseOutlined />
                                                </Tooltip>
                                            ) :
                                                (
                                                    <Tooltip title="publish" onClick={(e) => { handlePublish(e, course._id) }}>
                                                        <CheckOutlined />
                                                    </Tooltip>
                                                )
                                    }

                                </div>
                            </div>

                            {/* -------------------------- COURSE DESCRIPTION --------------------------- */}
                            <div className="row description">
                                {course.description}
                            </div>

                            {/* -------------------------- BUTTON FOR ADDING LESSON ---------------------- */}
                            <div className="row">
                                <Button
                                    // When add new lesson button clicked set the visible to be true so modal can be shown
                                    onClick={() => { setVisible(true) }}

                                    className='col-md-6 offset-md-3 text-center'
                                    type="primary"
                                    shape="round"
                                    icon={<UploadOutlined></UploadOutlined>}>
                                    Add Lesson
                                </Button>
                            </div>

                            {/* THIS MODAL WILL BE SHOWN WHEN THE USER CLICKS ON THE ADD LESSON BUTTON */}
                            <Modal title="+ Add Lesson"
                                centered
                                onCancel={() => { setVisible(false) }}
                                footer={null}
                                // When visible will be true then show the modal
                                open={visible}>
                                <AddLessonForm
                                    values={values}
                                    setValues={setValues}
                                    uploading={uploading}
                                    handleVideo={handleVideo}
                                    uploadButtonText={uploadButtonText}
                                    progress={progress}
                                    handleVideoRemove={handleVideoRemove}
                                    handleAddLesson={handleAddLesson} />
                            </Modal>
                            {/* ------------------------- MODAL FOR ADDING COURSES ------------------------- */}

                            {/* -------------------------  DISPLAYING THE LESSONS -------------------------- */}
                            <div className="row pb-5">
                                <div className="col lesson-list">
                                    <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                                    <List
                                        itemLayout='horizontal'
                                        dataSource={course && course.lessons}
                                        renderItem={(item, index) => (

                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar>{index + 1}</Avatar>}
                                                    title={item.title}
                                                ></List.Item.Meta>
                                            </List.Item>
                                        )}>
                                    </List>
                                </div>
                            </div>

                            {/* ------------------------------------- */}
                        </div>
                    )}
            </div>
        </InstructorRoute >

    )
}

export default CourseView