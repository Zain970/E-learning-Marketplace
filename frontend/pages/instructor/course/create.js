import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer"
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import { useRouter } from "next/router";

const CourseCreate = () => {

    const router = useRouter();
    // state
    const [values, setValues] = useState({
        name: "",
        description: "",
        paid: true,
        price: "",
        category: "",
        uploading: false,
        loading: false
    });

    // Image after uploading to the s3 from the backend
    const [image, setImage] = useState("");

    const [preview, setPreview] = useState("");

    // Upload image or image name once it is uploaded
    const [uploadButtonText, setUploadButtontext] = useState("Upload Image");


    const handleChange = (e) => {

        setValues({ ...values, [e.target.name]: e.target.value });
    }
    const handleImage = (e) => {

        let file = e.target.files[0];
        console.log("File : ", file);
        console.log("Preview : ", window.URL.createObjectURL(file));

        setPreview(window.URL.createObjectURL(file));
        setUploadButtontext(file.name);
        setValues({ ...values, loading: true })

        // Resize the image and then send the resize image to the backend
        // uri is the image in the binary format
        Resizer.imageFileResizer(file, 720, 500, "JEPG", 100, 0, async (uri) => {
            try {

                const { data } = await axios.post("/api/course/upload-image", {
                    image: uri
                });
                // This contains the object which contains the path and other things about the image
                console.log("Image got from backend : ", data);

                // Set image object got from the backend to the state variable
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

            // Sending the request to the backend to remove the image from the s3 bucket
            const res = await axios.post("/api/course/remove-image", {
                image
            });

            setImage({});
            setPreview("");
            setUploadButtontext("Upload Image");

            // Set loading to the false after removing the image
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

        e.preventDefault();
        // Sending all the data to the backend to create the course
        try {
            const { data } = await axios.post("/api/course", {
                ...values, image
            })

            toast("Great ! Now you can start adding lessons");

            // Redirect them to the dashboard
            router.push("/instructor");
        }
        catch (error) {
            toast(error.response.data)

        }

    }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">
                Create Course
            </h1>
            <div className="pt-3 pb-3">
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    values={values}
                    preview={preview}
                    handleImageRemove={handleImageRemove}
                    uploadButtonText={uploadButtonText}
                    setValues={setValues}>
                </CourseCreateForm>
            </div>
        </InstructorRoute>
    )
}

export default CourseCreate; 