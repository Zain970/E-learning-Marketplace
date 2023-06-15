import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../context";
// Axios for making requests
import axios from "axios";
// Next Js
import Link from "next/link";
import { useRouter } from "next/router";
// Antd
import { SyncOutlined } from "@ant-design/icons";

// ----------------------------------------------------------------------------

function forgotPassword() {
    // state 
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    
    const [loading, setLoading] = useState("");
    const router = useRouter();
    const { state: { user } } = useContext(Context);

    // Redirect to the home page if the user is logged in
    useEffect(() => {

        if (user !== null) {

            router.push("/");
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post("/api/forgot-password", {
                email
            });

            setSuccess(true);
            toast("Check your email for the secret code");

            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            toast(error.response.data);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {

            setLoading(true);
            const { data } = await axios.post("/api/reset-password", {
                email,
                code,
                newPassword
            });

            setEmail("");
            setCode("");
            setNewPassword("");
            setLoading("");
            toast("Great! Now you can login with your new password")

        }
        catch (error) {
            console.log("Error : ", error);
            setLoading(false);
            toast(error.response.data);
        }
    }

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Forgot Password
            </h1>

            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={success ? handleResetPassword : handleSubmit}>
                    <input
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        placeholder="Enter email"
                        required
                        onChange={(e) => { setEmail(e.target.value) }}
                    />

                    {
                        success && <>
                            <input
                                type="text"
                                className="form-control mb-4 p-4"
                                value={code}
                                placeholder="Enter secret code"
                                required
                                onChange={(e) => { setCode(e.target.value) }}
                            />

                            <input
                                type="password"
                                className="form-control mb-4 p-4"
                                value={newPassword}
                                placeholder="Enter new password"
                                required
                                onChange={(e) => { setNewPassword(e.target.value) }}
                            />

                        </>
                    }

                    <button
                        type="submit"
                        className="btn btn-primary btn-block p-2"
                        disabled={loading || !email}>

                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>

                </form>
            </div>
        </>
    )
}

export default forgotPassword