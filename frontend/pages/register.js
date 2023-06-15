import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../context";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useContext(Context);
    const { user } = state;


    const router = useRouter();

    useEffect(() => {

        if (user !== null) {
            router.push("/");
        }
    }, [user])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Post request to the register controller
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/register`, {
                name,
                email,
                password
            });
            // Success message at the top
            toast.success("Registration successful . Please login.")
            // Set Loading to the false
            setName("");
            setPassword("");
            setEmail("");
            setLoading(false);
        }
        catch (err) {
            // Error message at the top recieved from the server
            toast.error(err.response.data);
            // Set Loading to the false
            setLoading(false);
        }
    }
    return (
        <>

            <h1 className="jumbotron bg-primary square text-center">
                Register
            </h1>

            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>

                    {/* ----------------- NAME ----------- */}
                    <input
                        type="text"
                        className="form-control mb-4 p-4"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        placeholder="Enter name" />

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


                    {/* ------------- SUBMIT BUTTON */}
                    <button
                        style={{ width: "690px" }}
                        type="submit"
                        className="btn btn-block btn-primary p-2"
                        disabled={!name || !email || !password || loading}>
                        {loading ? <SyncOutlined spin /> : "Submit"}

                    </button>
                </form>

                <p className="text-center p-3">
                    Already registered?{"  "}
                    <Link href="/login">
                        Login
                    </Link>
                </p>

            </div>
        </>

    )
}

export default Register