import Link from 'next/link'
import { useState, useEffect } from 'react';

// Side bar nav on the instructor index page
function InstructorNav() {

    const [current, setCurrent] = useState("");

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname])
    return (
        <div className="nav flex-column nav-pills mt-2">
            <Link href="/instructor" className={`nav-link ${current === "/instructor" && "active"}`}>
                Dashboard
            </Link>
            <Link href="/instructor/course/create" className={`nav-link ${current === "/instructor/course/create" && "active"}`} >
                Course Create
            </Link>


        </div>
    )
}

export default InstructorNav