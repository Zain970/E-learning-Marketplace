import { Button, Progress, Switch } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import ReactPlayer from "react-player"

function UpdateLessonForm({ current, setCurrent, handleUpdateLesson, uploading, uploadVideoButtonText, handleVideoUpload, progress }) {

    return (
        <form style={{ height: "1000px" }} onSubmit={handleUpdateLesson}>

            {/*-------------------- TITLE ------------------------- */}
            <input

                type="text"
                className='form-control square'

                // State Variable
                value={current.title}
                autoFocus
                required
                onChange={(e) => { setCurrent({ ...current, title: e.target.value }) }} />

            {/* ---------------------  CONTENT  -------------------- */}
            <textarea
                className="form-control mt-3"
                cols="7"
                rows="7"
                // State Variable
                value={current.content}
                onChange={(e) => { setCurrent({ ...current, content: e.target.value }) }}>

            </textarea>

            {/* -------------------  VIDEO UPLOAD  -------------------  */}
            <div>

                {!uploading && current.video && current.video.Location && (
                    <div className='pt-2 d-flex justify-content-center'>
                        <ReactPlayer
                            style={{ border: "1px solid black", width: "100%" }}
                            url={current.video.Location}
                            width="410px"
                            controls
                        />
                    </div>
                )}

                <label className='btn btn-dark btn-block text-left mt-3' style={{ width: "100%" }}>
                    {uploadVideoButtonText}

                    <input
                        type="file"
                        hidden
                        onChange={handleVideoUpload}
                        accept="video/*" />
                </label>

            </div>


            {/* IF PROGRESS IS GREATER THAN 0 IT MEANS SOMETHING HAPENNING IN THE PROGRESS */}
            {progress > 0 && (<Progress
                percent={progress}
                steps={10}
                className='d-flex justify-content-center pt-2' />
            )}

            {/* ---------------------------- FREE PREVIEW ------------------ */}
            <div className="d-flex justify-content-between">
                <span className='pt-3 badge' style={{ position: "relative", fontSize: "16px", color: "black" }}>Preview</span>
                <Switch className='float-right mt-2'
                    disabled={uploading}
                    name="free_preview"
                    onChange={(v) => { setCurrent({ ...current, free_preview: v }) }}
                    checked={current.free_preview}>
                </Switch>
            </div>

            {/* IF THE UPLOADING IS TRUE THEN THE BUTTON WILL BE DISABLED BY DEFAULT */}
            <Button
                onClick={handleUpdateLesson}
                style={{ width: "100%" }}
                className='col mt-3 Savebtn'
                size="large"
                type="primary"
                loading={uploading}
                shape="round">
                Save
            </Button>


        </form>
    )
}

export default UpdateLessonForm