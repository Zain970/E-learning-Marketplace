import React from 'react'
import { Button, Menu, Avatar } from "antd";
import ReactMarkdown from "react-markdown"
import ReactPlayer from "react-player";
import { useState, useEffect, createElement } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import {
    MenuFoldOutlined,
    PlayCircleOutlined,
    CheckCircleFilled,
    MinusCircleFilled,
    MenuUnfoldOutlined
} from "@ant-design/icons"

import StudentRoute from '../../../components/routes/StudentRoute';

function SingleCourse() {

    // To show which lesson has been clicked to show their content or video
    const [clicked, setClicked] = useState(-1);

    // Collapsed Side Menu
    const [collapsed, setCollapsed] = useState(false);

    // COMPLETED LESSON TO MARKTHEM  AS COMPLETED 
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState();

    // Additional temporary state
    // To force state update
    const [updateState, setUpdateState] = useState(false);


    const router = useRouter();
    const { slug } = router.query;


    // Initially error because courses would not have been fetched
    const [course, setCourse] = useState({
        lessons: []
    })

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/user/course/${slug}`)
        setCourse(data);
    }
    useEffect(() => {
        if (slug) {
            loadCourse();
        }

    }, [slug])

    const loadCompletedLessons = async () => {
        const { data } = await axios.post("/api/list-completed", {
            courseId: course._id
        })
        console.log("COMPLETED LESSONS => ", data);
        setCompletedLessons(data);
    }

    useEffect(() => {
        console.log("We have to load completed lessons");
        if (course) {

            loadCompletedLessons();
        }
    }, [course])

    // MARK THE LESSON AS COMPLETED
    const markCompleted = async () => {

        const { data } = await axios.post("/api/mark-completed", {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id
        });
        console.log('Mark Completed : ', data);
        setCompletedLessons([...completedLessons, course.lessons[clicked]._id])
    }

    // MARK THE LESSON AS INCOMPLETED
    const markInCompleted = async () => {
        try {
            const { data } = await axios.post("/api/mark-incomplete", {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id
            });

            console.log('Mark Incompleted : ', data);

            const all = completedLessons;

            const index = all.indexOf(course.lessons[clicked]._id)

            if (index > -1) {
                all.splice(index, 1);
                console.log("ALL WITHOUT REMOVED ==> : ", all);
                setCompletedLessons(all);

                setUpdateState(!updateState);

            }
        }
        catch (error) {
            console.log("Error : ", error);

        }
    }

    return (
        <StudentRoute>

            <div className="row">
                <div style={{ maxWidth: "320px" }}>

                    <Menu
                        // Clicked one will be selected
                        defaultSelectedKeys={[clicked]}
                        inlineCollapsed={collapsed}

                        style={{ height: "40vh", overflow: "scroll" }}>
                        {
                            course.lessons.map((lesson, index) => (
                                <Menu.Item
                                    // 1).From the index we can know which item has been clicked
                                    // 2).Grab the index of the lesson
                                    // 3).From the index we can know which item has been clicked
                                    onClick={() => {
                                        console.log("Index : ", index);
                                        // Storing the lesson who is clicked in the state
                                        setClicked(index)
                                    }}
                                    key={index}
                                    // Numbering for the lesson
                                    icon={<Avatar>{index + 1}</Avatar>}
                                >
                                    {lesson.title.substring(0, 30)}

                                    {
                                        completedLessons.includes(lesson._id) ? (
                                            <>
                                                <CheckCircleFilled
                                                    className='float-right text-primary ml-2'
                                                    style={{ marginTop: "13px" }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <MinusCircleFilled
                                                    style={{ marginLeft: "10px", marginTop: "13px" }}
                                                    className='float-right text-danger ml-2' />

                                            </>
                                        )}
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </div>

                {/* ------------------------------------------------------------------------ */}
                <div className="col">
                    {
                        clicked !== -1 ? (
                            <>

                                <div className="col alert alert-primary square">
                                    <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                                    {
                                        completedLessons.includes(course.lessons[clicked]._id) ? (
                                            <>
                                                <span
                                                    style={{ marginLeft: "10px" }}
                                                    className='float-right pointer'
                                                    onClick={markInCompleted}>
                                                    Mark as incompleted
                                                </span>
                                            </>

                                        ) : (
                                            <>
                                                <span
                                                    style={{ marginLeft: "10px" }}
                                                    onClick={markCompleted}
                                                    className="float-right pointer">
                                                    Mark as completed
                                                </span>
                                            </>
                                        )
                                    }
                                </div>
                                {
                                    course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                                        <>
                                            <div className="wrapper">
                                                <ReactPlayer
                                                    width="100%"
                                                    height="100%"
                                                    className="player"
                                                    controls
                                                    url={course.lessons[clicked].video.Location}>
                                                </ReactPlayer>
                                            </div>
                                        </>
                                    )}

                                <p>{course.lessons[clicked].content}</p>
                            </>

                        ) : (
                            <div className='d-flex justify-content-center p-5'>
                                <div className="text-center p-5">
                                    <PlayCircleOutlined style={{ width: "200px" }} className='text-primary display-1 p-5' />
                                    <h1 className="lead">Click on the lessons to start learning</h1>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </StudentRoute>
    )
}

export default SingleCourse