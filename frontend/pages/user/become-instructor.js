import axios from "axios";
import { Context } from "../../context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
import { Button } from "antd";
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from "@ant-design/icons";

const BecomeInstructor = () => {
    const [loading, setLoading] = useState();
    const { state: { user }, dispatch } = useContext(Context);

    const becomeInstructor = async () => {
        try {

            setLoading(true);
            const { data } = await axios.get("/api/make-instructor");
            setLoading(false);
            toast("You are now instructor.You can upload courses");
            // Setting the global state equal to the user
            dispatch({
                type: "LOGIN",
                payload: data
            })

            localStorage.removeItem("user");

            // Saving in the local storage
            window.localStorage.setItem("user", JSON.stringify(data));

            // // Once saved in the local storage we can redirect the user (redirect)
            window.location.href = "/instructor";

        }
        catch (error) {
            console.log("Error : ", error);
            toast.error(err.response.data);
            setLoading(false);
        }
    }

    return (
        <UserRoute>
            <h1 className="jumbotron text-center square">
                Become Instructor
            </h1>

            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <div className="pt-4">

                            {/* USER ICON */}
                            <UserSwitchOutlined className="display-1 pb-3" />

                            <h2>Setup payout to publish courses on Elearning</h2>
                            <p className="lead text-warning">
                                Elearning partners with stripe to transfer earnings to your bank
                                account
                            </p>
                            <Button
                                className="mb-3"
                                type="primary"
                                shape="round"
                                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                                size="large"
                                block
                                onClick={becomeInstructor}
                                disabled={user && user.role && user.role.includes("Instructor") || loading}>
                                {loading ? "Processing..." : "Payout Setup"}
                            </Button>
                        </div>

                        <p className="lead">
                            You will be redirected to stripe to complete onboarding process.
                        </p>

                    </div>
                </div>
            </div>
        </UserRoute>
    )
}

export default BecomeInstructor;