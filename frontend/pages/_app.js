// Installed Packages
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

// Toast package
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

// Components
import TopNav from "../components/TopNav";

// Context Api
import { Provider } from "../context";

// Custom Global Css
import "../public/css/styles.css"

// Very important component , this is entry point of our website
function MyApp({ Component, pageProps }) {

    return (
        <Provider>
            <ToastContainer position="top-center" />
            <TopNav />
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp;