
import { Select, Button, Avatar, Badge } from "antd";
import { SaveOutlined } from "@ant-design/icons";
const { Option } = Select;


function CourseCreateForm({ handleSubmit, handleImage, handleChange, values, setValues, preview, uploadButtonText, handleImageRemove, editPage = false }) {

    let children = [];

    for (let i = 1.99; i <= 90.99; i++) {
        children.push(<Option value={i.toFixed(2)} key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }

    const paidValueChange = (v) => {

        setValues({ ...values, price: v })
    }

    const paidOrFree = (v) => {

        setValues({ ...values, paid: v, price: 0 })
    }
    return (

        <>
            {values && (
                <form onSubmit={handleSubmit} className="form-group">

                    {/* -------------- NAME -------------- */}
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Name" />
                    </div>

                    {/*------------- DESCRIPTION -------------- */}
                    <div className="form-group">
                        <textarea
                            style={{ marginTop: "10px" }}
                            className="form-control"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            cols="7"
                            rows="7"
                            placeholder='Description'>
                        </textarea>
                    </div>

                    {/*------------ PAID OR FREE OPTION ------------- */}
                    <div className="form-row pt-3">
                        <div className="col">
                            <div className="form-group">
                                <Select
                                    style={{ width: "100%", marginBottom: "20px" }}
                                    size="large"
                                    value={values.paid}
                                    onChange={paidOrFree}>

                                    <Option value={true}>Paid</Option>
                                    <Option value={false} >Free</Option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {
                        values.paid && (

                            <div className="form-group">
                                <Select
                                    defaultValue="$1.99"
                                    style={{ width: "100%", marginBottom: "20px" }}
                                    onChange={paidValueChange}
                                    value={values.price}
                                    tokenSeparators={[,]}
                                    size="large"
                                >
                                    {children}
                                </Select>
                            </div>

                        )
                    }

                    {/* -------------- CATEGORY -------------- */}
                    <div className="form-group">
                        <input
                            style={{ marginBottom: "10px" }}
                            className="form-control"
                            name="category"
                            value={values.category}
                            onChange={handleChange}
                            type="text"
                            placeholder="Category" />
                    </div>


                    {/* ----------- IMAGE UPLOAD ---------- */}
                    <div className="form-row">
                        <div className="col">
                            <div className="form-group">
                                <label className="btn btn-outline-secondary btn-block text-left">
                                    {uploadButtonText}
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImage}
                                        accept="image/*"
                                        hidden
                                        id="" />
                                </label>
                            </div>
                        </div>


                        {/*----------------------------- WHEN COURSE IS BEING CREATED ------------------------------- */}
                        {/* -------------- WHEN USER UPLOADS THE IMAGE PREVIEW WILL BE SET TO BE TRUE --------------- */}

                        {
                            preview && (
                                <div style={{ position: "relative", left: "350px", bottom: "35px" }}>
                                    <Badge count="X" onClick={handleImageRemove} className="pointer">
                                        <Avatar width={200} src={preview} />
                                    </Badge>
                                </div>

                            )
                        }

                        {/* WHEN COURSE IS BEING EDITED */}
                        {/* EXISTING COURSE IMAGE WILL BE SHOWN */}
                        {
                            editPage && values.image && (
                                <Avatar
                                    style={{ position: "relative", left: "350px", bottom: "40px" }}
                                    width={200}
                                    src={values.image.Location}>
                                </Avatar>
                            )
                        }

                    </div>

                    {/* ---------- SUBMIT BUTTON --------- */}
                    <div className="row">
                        <div className="col">
                            <Button
                                style={{ marginTop: "5px", height: "50px" }}
                                onClick={handleSubmit}
                                className="btn btn-primary"
                                loading={values.loading}
                                disabled={values.loading || values.uploading}>

                                {values.loading ? "Saving..." : "Save and Continue"}

                            </Button>
                        </div>
                    </div>

                </form >
            )}
        </>

    )
}

export default CourseCreateForm