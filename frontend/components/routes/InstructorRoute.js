import { useState, useEffect, useContext } from 'react'
import InstructorNav from '../nav/InstructorNav';
import { SyncOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";

import axios from 'axios';


function InstructorRoute({ children }) {
    const [ok, setOk] = useState(false);
    const router = useRouter();

    const fetchUser = async () => {

        try {
            const { data } = await axios.get("/api/current-instructor");

            if (data.ok) {
                setOk(true)
            }
        }
        catch (err) {

            // If it is a user and not a instructor then he will be redirected to the user page
            setOk(false);
            router.push("/");
        }
    }
    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <>
            {
                !ok ? (
                    <SyncOutlined
                        spin
                        className='d-flex justify-content-center display-1 text-primary p-5'>
                    </SyncOutlined>
                ) : (
                    <div className='container-fluid'>
                        <div className="row">
                            <div className="col-md-2">
                                <InstructorNav />\
                            </div>
                            <div className="col-md-10">
                                {children}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default InstructorRoute