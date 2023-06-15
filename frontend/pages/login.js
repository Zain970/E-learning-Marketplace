import { useState, useContext, useEffect } from "react";
import axios from "axios";

// Message at the top after clicking the register button
import { toast } from "react-toastify";

// Next Js
import Link from "next/link";
import { useRouter } from "next/router";

// From Antd (Loading spinner)
import { SyncOutlined } from "@ant-design/icons";

import { Context } from "../context";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Global state
    const { state, dispatch } = useContext(Context);

    // For redirect
    const router = useRouter();

    const { user } = state;

    // If the user is logged in push to the home page (user is not null)
    useEffect(() => {

        if (user !== null) {

            router.push("/user");
        }

    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const { data } = await axios.post(`/api/login`, {
                email,
                password
            });

            // Setting the global state equal to the user
            dispatch({
                type: "LOGIN",
                payload: data
            })

            // Saving in the local storage
            window.localStorage.setItem("user", JSON.stringify(data));

            // Once saved in the local storage we can redirect the user (redirect)
            router.push("/")
        }
        catch (err) {
            console.log("error : ", err);
            // Error message at the top recieved from the server
            toast.error(err.response.data);
            setLoading(false);

        }
    }
    return (
        <>

            <h1 className="jumbotron bg-primary square text-center">
                Login
            </h1>

            <div className="container col-md-4 offset-md-4 pb-5" style={{ marginTop: "100px" }}>
                <form onSubmit={handleSubmit}>

                    {/* ----------------- EMAIL -------------- */}
                    <input
                        type="email"
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        placeholder="Enter Email" />

                    {/* ----------------- PASSWORD -------------- */}
                    <input
                        type="password"
                        className="form-control mb-4 p-4"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        placeholder="Enter Password" />


                    {/* ------------- SUBMIT BUTTON ------------- */}
                    <button
                        type="submit"
                        style={{ width: "690px" }}
                        className="btn btn-block btn-primary p-2"
                        disabled={!email || !password || loading}>
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>

                </form>

                <p className="text-center p-3">
                    Not yet registered ?{"  "}
                    <Link href="/register">
                        Register
                    </Link>
                </p>


                <p className="text-center">
                    <Link href="/forgot-password" className="text-danger">
                        Forgot password
                    </Link>
                </p>


            </div>
        </>

    )
}

export default Login