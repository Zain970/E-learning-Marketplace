import Link from 'next/link';
import { useRouter } from "next/router";

import { useEffect } from 'react';
function ErrorPage() {
    const router = useRouter();

    const handleInput = () => {
        router.push("/");
    }

    useEffect(() => {

        // After 3 seconds user will be pushed to the home page
        setTimeout(() => {
            router.push("/");
        }, 3000)

    }, []);
    return (
        <div>
            <h1>We are sorry, Page not found!</h1>
            <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable</p>

            {/*----------- method-1 ---------- */}

            {/* <Link href="/">
                Home Page
            </Link>
             */}

            {/*----------- method-2 ----------- */}

            {/* <a onClick={() => { router.push("/") }}>Home Page</a>*/}

            {/*----------- method-3 ----------- */}

            <a onClick={handleInput}>Home Page</a>

        </div>
    )
}

export default ErrorPage