import { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import Avatar from 'antd';
import Course from '../../components/Course';

import InstructorRoute from '../../components/routes/InstructorRoute';

function InstructorIndex() {
    // State variable to save all the courses
    const [courses, setCourses] = useState([]);

    useEffect(() => {

        // Fetching all the course of the logged in user
        loadCourses();
    }, [])

    const loadCourses = async () => {
        try {
            // Request to get all the courses of the user
            const { data } = await axios.get("/api/instructor-courses");
            setCourses(data);
        }
        catch (err) {
            console.log("Error : ", err);
        }
    }

    return (
        <InstructorRoute>
            <h1 className="jumbotron text-center square">
                Instructor Dashboard
            </h1>
            {
                courses && courses.map((course) => {
                    console.log("course : ", course);
                    return (

                        <Course key={course._id} {...course}>

                        </Course>
                    )
                })}
        </InstructorRoute>
    )
}

export default InstructorIndex