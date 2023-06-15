
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";

import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/previewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";

import { toast } from "react-toastify";

import { Context } from "../../context/index";

function SingleCourse() {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    // For checking if the user is enrolled in the course or not
    const [enrolled, setEnrolled] = useState({});
    // Context for login user
    const { state: { user } } = useContext(Context);

    const [course, setCourse] = useState();

    const router = useRouter();
    const { slug } = router.query;

    //////////////////////////////////////////////////////////////////////// GET COURSE DATA ///////////////////////////////////////////////////////////////////////////////////

    const getCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        console.log("Course : ", data);
        setCourse(data);
    }
    useEffect(() => {
        getCourse();
    }, [slug])

    ///////////////////////////////////////////////////////////////////////////////////////////////////


    const handleFreeEnrollment = async (e) => {
        e.preventDefault();

        try {

            // Check if user is logged in  and if not push to login page
            if (!user) {
                return router.push("/login");
            }

            // Check if already enrolled and push them to the course page if already logged in 
            if (enrolled.status) {

                return router.push(`/user/course/${enrolled.course.slug}`)
            }

            setLoading(true);
            const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
            toast(data.message);
            setLoading(false);

            console.log('Data : ', data);
            router.push(`/user/course/${data.course.slug}`)

        }
        catch (error) {
            toast("Enrollment failed . Try again");
            setLoading(false)
        }
    }
    const handlePaidEnrollment = () => {

        console.log("Handle paid payments");

        router.push(`course/payments`);
    }
    const checkEnrollment = async () => {
        const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
        console.log("Check enrollment : ", data);

        console.log("Enrolled : ", enrolled);
        setEnrolled(data);
    }

    // Chec if the user is enrolled in this course
    useEffect(() => {
        if (user && course) {
            checkEnrollment()
        }
    }, [user, course])


    return (
        <>
            {
                course && (
                    <SingleCourseJumbotron
                        course={course}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        setPreview={setPreview}
                        user={user}
                        loading={loading}
                        handleFreeEnrollment={handleFreeEnrollment}
                        handlePaidEnrollment={handlePaidEnrollment}
                        enrolled={enrolled}
                        setEnrolled={setEnrolled}
                        preview={preview} />
                )
            }
            <PreviewModal
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview} />

            {
                course && course.lessons && (
                    <SingleCourseLessons
                        lessons={course.lessons}
                        setPreview={setPreview}
                        setShowModal={setShowModal}
                        showModal={showModal} />
                )
            }

        </>
    )
}



export default SingleCourse
