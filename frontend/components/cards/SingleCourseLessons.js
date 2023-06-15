import React from 'react'
import { Avatar, List } from "antd";
const { Item } = List;

function SingleCourseLessons({ lessons, setPreview, showModal, setShowModal }) {
    return (
        <div className="container" style={{ marginTop: "20px", marginLeft: "50px" }}>
            <div className="row">
                <div className="col lesson-list">
                    {lessons && <h4>{lessons.length} Lessons</h4>}

                    <hr />
                    <List
                        itemLayout='horizontal'
                        dataSource={lessons}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>{index + 1}</Avatar>}
                                    title={item.title}
                                />
                                {item.video && item.video !== null && item.free_preview && (
                                    <span
                                        className='text-primary pointer'
                                        onClick={() => {
                                            setPreview(item.video.Location)
                                            setShowModal(!showModal)
                                        }}>
                                        Preview
                                    </span>
                                )}

                            </List.Item>
                        )}
                    >

                    </List>
                </div>
            </div>
        </div>
    )
}

export default SingleCourseLessons