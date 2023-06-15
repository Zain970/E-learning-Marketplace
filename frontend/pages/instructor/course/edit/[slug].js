import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer"
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import { useRouter } from "next/router";
import { Avatar, Tooltip, Button, Modal, List, Item } from 'antd'
import { DeleteOutlined } from "@ant-design/icons";


// UPDATE LESSON FORM
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const CourseEdit = () => {

    const router = useRouter();
    // STATE VARIABLE
    const [values, setValues] = useState({
        name: "",
        description: "",
        paid: true,
        price: "",
        category: "",
        uploading: false,
        loading: false,
        lessons: []

    });

    // WHEN ADDING A NEW COURSE -----------------------------------
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [uploadButtonText, setUploadButtontext] = useState("Upload Image");

    // STATE FOR LESSONS UPDATE -----------------------------------
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState({});
    const [uploadVideoButtonText, setUploadVideoButtonText] = useState("Upload Video");


    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);


    const { slug } = router.query;


    const loadCourse = async () => {

        const { data } = await axios.get(`/api/course/${slug}`)
        console.log("Course fetched from backend : ", data);

        if (data) {
            setValues(data);
        }

        if (data && data.image) {
            setImage(data.image);
        }

    }

    useEffect(() => {
        loadCourse();
    }, [slug])


    const handleChange = (e) => {

        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleImage = (e) => {

        let file = e.target.files[0];
        console.log("File : ", file);
        console.log("Preview : ", window.URL.createObjectURL(file));

        setPreview(window.URL.createObjectURL(file));
        setUploadButtontext(file.name);
        setValues({ ...values, loading: true });

        // Resize the image and then send the resize image to the backend
        // uri is the image in the binary format
        Resizer.imageFileResizer(file, 720, 500, "JEPG", 100, 0, async (uri) => {
            try {
                const { data } = await axios.post("/api/course/upload-image", {
                    image: uri
                });
                console.log("Image got from backend : ", data);

                // Set image object got from the backend to the state variable
                // If we upload a new image then it will point to the new image
                setImage(data);
                setValues({ ...values, loading: false })

            }
            catch (err) {
                console.log("Error : ", err);
                setValues({ ...values, loading: false });
                toast("Image upload failed.Try later")
            }
        })
    }

    const handleImageRemove = async () => {
        try {

            // Set loading to true before removing the image
            setValues({ ...values, loading: false });

            const res = await axios.post("/api/course/remove-image", {
                image
            });

            setImage({});
            setPreview("");
            setUploadButtontext("Upload Image");
            setValues({ ...values, loading: false })
        }
        catch (err) {
            console.log("Error : ", err);

            // If any error then set the loading to the false
            setValues({ ...values, loading: false });
            toast("Image upload failed .Try Later")
        }
    }

    const handleSubmit = async (e) => {
        console.log("Values : ", values);

        e.preventDefault();

        // Sending all the data to the backend to update the course
        try {
            const { data } = await axios.put(`/api/course/${slug}`, {
                ...values, image
            })

            toast("Course updated!");
        }
        catch (error) {
            toast(error.response.data)
        }
    }

    // WE KNOW WHICH ITEM IS BEING DRAGGED AND WHERE IT IS BEING DROPPED
    const handleDrag = (e, index) => {

        e.dataTransfer.setData("itemIndex", index);

    }
    const handleDrop = async (e, index) => {

        // 1).Which item has been dragged
        const movingItemIndex = e.dataTransfer.getData("itemIndex");

        // 2).Where it has been dropped
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex];

        // Remove the moving item from the array
        allLessons.splice(movingItemIndex, 1);            // Remove 1 item from the given index

        // 0 means we are not removing anyting
        allLessons.splice(targetItemIndex, 0, movingItem); // Push moving  item after target item index

        setValues({ ...values, lessons: [...allLessons] });

        // SAVE THE NEW LESSONS ORDER IN THE DATABASE
        const { data } = await axios.put(`/api/course/${slug}`, {
            ...values, image
        })

        console.log("Lessons re- arranged response : ", data);
        toast("Lessons rearranged successfully");
    }
    const handleLessonDelete = async (index) => {
        const answer = window.confirm("Are you sure you want to delete?");
        if (!answer) {
            return
        }
        const allLessons = values.lessons;

        // 1).Deleting the lesson
        // 2).removeLesson is an array
        const removeLesson = allLessons.splice(index, 1);
        console.log("Removed Lesson : ", removeLesson);

        setValues({ ...values, lessons: allLessons });

        // NOW SENDIDNG THE REQUEST TO THE BACKEND TO DELETE THE LESSON
        const { data } = await axios.put(`/api/course/${slug}/${removeLesson[0]._id}`);

        console.log('Lesson deleted : ', data);
    }

    // -----------------------------------------------------------------------------------------
    // ---------------------- LESSON UPDATE FUNCTIONS ------------------------------------------
    //------------------------------------------------------------------------------------------
    const handleVideoUpload = async (e) => {
        console.log("Handle video upload")

        // Remove previos video
        if (current.video && current.videe.Location) {
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, current.video)
            console.log("Removed : ", res);
        }

        const file = e.target.files[0];
        setUploadVideoButtonText(file.name);


        setUploading(true);

        // Send video as the form data
        const videoData = new FormData();
        videoData.append("video", file);
        videoData.append("courseId", values._id);

        const { data } = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
            onUploadProgress: (e) => {
                setProgress(Math.round((100 * e.loaded) / e.total));
            }
        });

        console.log("Data from backend after uploading video : ", data)

        setCurrent({ ...current, video: data })
        setUploading(false);

    }

    // When the lesson upate is finalized

    const handleUpdateLesson = async (event) => {
        event.preventDefault();

        console.log("Current lesson to be upated  : ", current);

        // Current points to the lesson we are updating
        const { data } = await axios.put(`/api/course/lesson/${slug}/${current._id}`, current);

        setUploadVideoButtonText("Upload Video");

        // Close the lesson update model
        setVisible(false);

        if (data.ok) {
            let arr = values.lessons;

            const index = arr.findIndex((el) => el._id === current._id);
            arr[index] = current;

            setValues({ ...values, lessons: arr });

            toast("Lesson updated");
        }
    }


    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">
                Edit Course
            </h1>

            {/* COURSE EDIT COMPONENT COMPONENT */}
            <div className="pt-3 pb-3">
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    preview={preview}
                    handleImageRemove={handleImageRemove}
                    uploadButtonText={uploadButtonText}
                    setValues={setValues}
                    editPage={true}>
                </CourseCreateForm>

                <hr />

                {/* -------------  DISPLAYING THE LESSONS ------------- */}
                {
                    values && (
                        <div className="row pb-5">
                            <div className="col lesson-list">
                                <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
                                <List
                                    onDragOver={(e) => { e.preventDefault() }}
                                    itemLayout='horizontal'
                                    dataSource={values && values.lessons}
                                    renderItem={(item, index) => (
                                        <List.Item
                                            onDragStart={e => handleDrag(e, index)}
                                            onDrop={e => handleDrop(e, index)}
                                            draggable>
                                            <List.Item.Meta
                                                avatar={<Avatar>{index + 1}</Avatar>}
                                                title={item.title}

                                                // Modal will appear with the current lesson you want to update
                                                // Clicked lesson will be saved in the 
                                                onClick={() => {
                                                    console.log("Item : ", item);
                                                    setVisible(true);
                                                    setCurrent(item);

                                                }}>
                                            </List.Item.Meta>

                                            <DeleteOutlined
                                                onClick={() => { handleLessonDelete(index) }}
                                                className="text-danger float-right"
                                            ></DeleteOutlined>
                                        </List.Item>
                                    )}>
                                </List>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* THIS MODAL WILL BE VISIBLE WHEN THE LESSON HAS TO BE UPDATED */}
            {/* THIS MODAL WILL CONTAIN THE DETAILS OF THE LESSON WHICH WAS CLICKED */}
            <Modal title="Update Lesson"
                centered open={visible}
                footer={null}
                onCancel={() => { setVisible(false) }}>
                <UpdateLessonForm
                    current={current}
                    setCurrent={setCurrent}
                    handleUpdateLesson={handleUpdateLesson}
                    handleVideoUpload={handleVideoUpload}
                    progress={progress}
                    uploading={uploading}
                    uploadVideoButtonText={uploadVideoButtonText} />

            </Modal>

        </InstructorRoute >
    )
}

export default CourseEdit;