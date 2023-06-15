
import { useState, useEffect } from "react"
import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

function Index({ courses }) {

    console.log("Course : ", courses);

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Online Education MarketPlace
            </h1>
            <div className="allCoursesMain">

                {
                    courses && (
                        courses.map((course) => {
                            return (
                                <div key={course._id} className="col-md-4">
                                    <CourseCard course={course}></CourseCard>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </>
    )
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.API}/courses`);

    return {
        props: {
            courses: data
        }
    }
}




export default Index

