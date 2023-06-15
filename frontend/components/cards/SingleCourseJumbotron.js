
import { Badge, Modal, Button } from "antd";
import ReactPlayer from "react-player";
import currencyFormatter from "../../utils/helpers";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";


function SingleCourseJumbotron({ course, showModal, setShowModal, preview, setPreview, loading, user, handleFreeEnrollment, handlePaidEnrollment, enrolled, setEnrolled }) {
    return (
        <div className="jumbotron bg-primary square" style={{ height: "400px", paddingLeft: "20px" }}>
            <div className="row">
                <div className="col-md-8">

                    {/*----------------- TITLE ---------------- */}
                    <h1 className="text-light font-weight-bold">
                        {course.name}
                    </h1>

                    {/*----------------- DESCRIPTION ------------ */}
                    <p className="load">
                        {course.description && course.description.substring(0, 160)} ....
                    </p>
                    {/*------------------ CATEGORY -------------- */}
                    <Badge count={course.category} style={{ backgroundColor: "#03a9f4" }} className="pb-4 mr-2" />

                    {/*----------------- AUTHOR ------------------ */}
                    <p>Created by {course.instructor.name}</p>

                    {/*----------------- UPDATED AT ---------------*/}
                    <p>Last updated {new Date(course.updatedAt).toLocaleDateString()}</p>

                    {/* -------------------- PRICE -----------------  */}
                    <h4 className="text-light"> {course.paid ? currencyFormatter({ amount: course.price, currency: "usd" }) : "Free"}</h4>

                </div>

                <div className="col-md-4">
                    {/* show video preview or course image */}
                    {/* If we have video in the first lesson then we will show it else we will show the course image */}
                    {
                        course.lessons[0].video && course.lessons[0].video.Location ? (
                            <div onClick={() => {
                                setPreview(course.lessons[0].video.Location)
                                setShowModal(!showModal)
                            }}>

                                <ReactPlayer
                                    className="react-player-div"
                                    width="100%"

                                    height="225px"
                                    url={course.lessons[0].video.Location}
                                />

                            </div>
                        ) : (
                            <div>
                                <img src={course.image.Location} alt={course.name} className="img img-fluid" />
                            </div>
                        )
                    }

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <LoadingOutlined className="h1 text-danger" />
                        </div>
                    ) : (
                        <div>
                            <Button
                                style={{ color: "white", border: "1px solid black", backgroundColor: "crimson" }}
                                className="mb-3 mt-3"
                                shape="round"
                                icon={<SafetyOutlined />}
                                type="danger"
                                size="large"
                                onClick={course.paid ? handlePaidEnrollment : handleFreeEnrollment}
                                disabled={loading}
                                block>
                                {user ? (enrolled.status ? "Go to course" : "Enroll") : "Login to enroll"}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default SingleCourseJumbotron