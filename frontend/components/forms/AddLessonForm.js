import { Button, Progress, Tooltip } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'

function AddLessonForm({ values, setValues, handleAddLesson, uploading, uploadButtonText, handleVideo, progress, handleVideoRemove }) {

    return (
        <form style={{ height: "500px" }} onSubmit={handleAddLesson}>

            {/*-------------------- TITLE ------------------------- */}
            <input
                type="text"
                className='form-control square'

                // State Variable
                value={values.title}
                placeholder='Title'
                autoFocus
                required
                onChange={(e) => { setValues({ ...values, title: e.target.value }) }} />

            {/* ---------------------  CONTENT  -------------------- */}
            <textarea
                className="form-control mt-3"
                cols="7"
                rows="7"
                // State Variable
                value={values.content}
                placeholder='Content'
                onChange={(e) => { setValues({ ...values, content: e.target.value }) }}>

            </textarea>

            {/* -------------------  VIDEO UPLOAD  -------------------  */}
            <div className="d-flex justify-content-center">
                <label className='btn btn-dark btn-block text-left mt-3' style={{ width: "100%" }}>
                    {uploadButtonText}
                    <input
                        type="file"
                        hidden
                        onChange={handleVideo}
                        accept="video/*" />
                </label>
                {!uploading && values.video.Location && (
                    <Tooltip title="remove">
                        <span onClick={handleVideoRemove} className='pt-1 pl-3'>
                            <CloseCircleFilled className='text-danger d-flex justify-content-center pt-4 pointer' />
                        </span>
                    </Tooltip>
                )}
            </div>


            {/* IF PROGRESS IS GREATER THAN 0 IT MEANS SOMETHING HAPENNING IN THE PROGRESS */}
            {progress > 0 && (<Progress
                percent={progress}
                steps={10}
                className='d-flex justify-content-center pt-2' />
            )
            }

            {/* IF THE UPLOADING IS TRUE THEN THE BUTTON WILL BE DISABLED BY DEFAULT */}
            <Button
                onClick={handleAddLesson}
                style={{ width: "100%" }}
                className='col mt-3 Savebtn'
                size="large"
                type="primary"

                // WHEN SENDING VIDEO TO THE BACKEND THEN THE LOADING WILL BE TRUE
                loading={uploading}
                shape="round">
                Save
            </Button>
        </form>
    )
}

export default AddLessonForm