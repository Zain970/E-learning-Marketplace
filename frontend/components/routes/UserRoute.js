
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import UserNav from '../nav/UserNav';

import { useState, useEffect, useContext } from 'react'

function UserRoute({ children }) {

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

                        <div className="row">
                            <div className="col-md-2">
                                <UserNav />
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

export default UserRoute