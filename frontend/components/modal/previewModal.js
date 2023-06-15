import { Modal } from "antd";
import ReactPlayer from "react-player";

function PreviewModal({ showModal, setShowModal, preview }) {
    return (
        <>
            <Modal
                title="Course Preview"
                onCancel={() => { setShowModal(!showModal) }}
                width={720}
                footer={null}
                open={showModal}
            >

                <div className="wrapper">
                    <ReactPlayer
                        url={preview}
                        playing={showModal}
                        width="100%"
                        height="100%"
                        controls={true}
                    />
                </div>
            </Modal>
        </>
    )
}

export default PreviewModal;