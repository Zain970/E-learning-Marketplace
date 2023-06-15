
import axios from 'axios';

import { SyncOutlined } from '@ant-design/icons';

import { useState, useEffect, useContext } from 'react'

function StudentRoute({ children }) {

    const [ok, setOk] = useState(false);

    const fetchInstructor = async () => {
        try {

            const { data } = await axios.get("/api/current-user");

            if (data.ok) {
                setOk(true);
            }
        }
        catch (err) {
            console.log("Error : ", err);
            setOk(false);
        }
    }

    useEffect(() => {

        fetchInstructor();
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
                        {children}
                    </div>
                )
            }
        </>
    )
}

export default StudentRoute