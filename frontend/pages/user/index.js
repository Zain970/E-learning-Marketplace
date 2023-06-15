import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context/index";

import axios from "axios";
import UserRoute from "../../components/routes/UserRoute";

import { Avatar } from "antd";

import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

function UserIndex() {

    const { state: { user } } = useContext(Context);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // GET ALL THE COURSES IN WHICH THE USER IS ENROLLED IN
    // GET ALL THE USER
    const loadCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/user-courses");
            setCourses(data);
            setLoading(false);
        }
        catch (error) {
            console.log("Error : ", error);
            setLoading(false);
        }
    }
    useEffect(() => {
        loadCourses();
    }, [])

    return (
        <UserRoute>

            {/* When loading spinning icon */}
            {loading && <SyncOutlined
                spin
                className='d-flex justify-content-center display-1 text-danger p-5' />}
            <h1 className="jumbotron text-center square">
                User dashboard
            </h1>

            {/* SHOW ALL THE COURSES */}
            {courses && courses.map((course) => {
                return (
                    <div key={course._id} className='media pt-2 pb-1'>
                        {/* Image */}
                        <Avatar size={80} shape="square" src={course.image ? course.image.Location : "/course.png"}>

                        </Avatar>

                        <div className="media-body pl-2">
                            <div className="row">
                                <div className="col">

                                    {/* COURSE NAME */}
                                    <Link href={`/user/course/${course.slug}`} className='pointer' style={{ position: "relative", left: "100px", textDecoration: "none", bottom: "90px" }}>
                                        <h5 className='mt-2 text-primary'>{course.name}</h5>
                                    </Link>

                                    {/* NUMBER OF LESSONS */}
                                    <p style={{ position: "relative", left: "100px", bottom: "100px" }}>{course.lessons.length} Lessons </p>

                                    {/* INSTRUCTOR NAME */}
                                    <p className='text-muted' style={{ position: "relative", left: "100px", bottom: "120px" }}>
                                        By {course.instructor.name}
                                    </p>
                                </div>


                                <div className="col-md-3 mt-3 text-center" style={{ position: "relative", bottom: "100px" }}>
                                    <Link href={`/user/course/${course.slug}`}>
                                        <PlayCircleOutlined className='h2 pointer text-primary' />
                                    </Link>

                                </div>

                            </div>
                        </div>
                    </div>
                )

            })}
        </UserRoute>
    )
}

export default UserIndex