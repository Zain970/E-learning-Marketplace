import React from 'react'
import Link from 'next/link'
import { Tooltip } from "antd"
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"

function Course({ _id, category, description, image, name, lessons, published, slug }) {
    return (
        <div className="singleCourse">

            {/* COURSE IMAGE */}
            <img src={image.Location} alt="" />

            {/* COURSE LINK WHERE THEY CAN GO AND CAN ADD COURSE MATERIALS */}
            <Link href={`/instructor/course/view/${slug}`} className='pointer h5 mt-2 text-primary courseName' >
                {name}
            </Link>

            {/* NUMBER OF LESSONS OF THE COURSE */}
            <div className="lessons">
                {lessons.length} lessons
            </div>

            {/* STATUS OF THE COURSE WHETHER PUBLISHED OR NOR */}
            <div className="courseStatus">
                {lessons.length < 5 ? (
                    <p style={{ color: "red" }}>At least 5 lessons are required to publish a course</p>
                )
                    : published ? (
                        <p style={{ color: "green" }}>Your course is live in the marketplace</p>
                    ) : (

                        <p style={{ color: "orange" }}>Your course is ready to be published</p>
                    )
                }
            </div>

            {/* X sign infront of the course */}
            <div className="publishStatus" title="Unpublished">
                {published ? (
                    <Tooltip>
                        <div title="Unpublish">
                            <CloseCircleOutlined></CloseCircleOutlined>
                        </div>
                    </Tooltip>

                ) : (
                    <Tooltip>
                        <div title="Publish">
                            <CloseCircleOutlined></CloseCircleOutlined>
                        </div>

                    </Tooltip>
                )
                }
            </div>

        </div>
    )
}

export default Course

// 26th March :- friday digital marketing
// 31st March :- Web Programming
// 6th June   :- NLP
// 7th June   :- DDE
// 9th June   :- MLOPS