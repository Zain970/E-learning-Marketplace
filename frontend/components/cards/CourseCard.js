import React from 'react'
import Link from "next/link";
import { Card, Badge } from "antd";
import currencyFormatter from '../../utils/helpers';

const { Meta } = Card;

function CourseCard({ course }) {
    const { name, instructor, image, price, slug, paid, category } = course;
    return (
        <div className="singleCourseMain">
            <Link href={`/course/${slug}`} className='courseCard' style={{ textDecoration: "none" }}>
                <div className="course-tumb">
                    <img src={image.Location} alt={name} />
                </div>

                <div className="course-details">

                    <span className="course-catagory">{category}</span>

                    <div className="course-bottom-details">

                        {/* INSTRUCTOR NAME */}
                        <div className="course-price">
                            <small>by {instructor.name}</small>
                        </div>

                        {/* PRICE */}
                        <div className="course-count">
                            <small> {paid ? currencyFormatter({ amount: price, currency: "usd" }) : "Free"}</small>
                        </div>
                    </div>

                    {/* CATEGORY */}
                    <Badge
                        count={category}
                        style={{ position: "relative", right: "10px", top: "15px", margin: "5px" }}
                        className='pb-2 mr-2'>
                    </Badge>

                </div>
            </Link>

        </div>
    )
}

export default CourseCard

