import { useState, useEffect } from 'react';
import Link from 'next/link'

// Side bar nav on the user index page
function UserNav() {

    const [current, setCurrent] = useState("");

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname])

    return (
        <div className="nav flex-column nav-pills mt-2">
            <Link href="/user" className={`nav-link ${current === "/instructor" && "active"}`}>
                Dashboard
            </Link>
        </div>
    )
}

export default UserNav