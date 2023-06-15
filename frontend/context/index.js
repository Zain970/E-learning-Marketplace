import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Initial state
const initialState = {
    user: null
};

const Context = createContext();

const rootReducer = (state, action) => {
    switch (action.type) {

        case "LOGIN":
            return { ...state, user: action.payload }
        case "LOGOUT":
            return { ...state, user: null }
        default:
            return state;
    }
}

const Provider = ({ children }) => {

    const router = useRouter();

    const [state, dispatch] = useReducer(rootReducer, initialState);

    // Upon loading , the Global state will get the user from the local storage
    useEffect(() => {

        dispatch({
            type: "LOGIN",
            payload: JSON.parse(window.localStorage.getItem("user"))
        });

    }, []);

    // ---------- Response Interceptor -------------
    // log the user out if the token has expired
    axios.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            console.log("OK");
            return response;
        },
        function (error) {
            console.log("error (Index Context) : ", error);

            // Any status code that falls outside the range of 2xx cause this function to trigger
            let res = error.response;

            if (res.status === 401 && res.config && !res.config._isRetryRequest) {

                return new Promise((resolve, reject) => {

                    axios
                        .get("/api/logout").then((data) => {

                            console.log("/401 error > logout ", data);

                            // Setting the global state to empty
                            dispatch({ type: 'LOGOUT' })

                            // Removing user from the local storage
                            window.localStorage.removeItem("user");

                            // Redirecting to the login page
                            router.push("/login");

                        })
                        .catch((err) => {
                            console.log("AXIOS INTERCEPTORS ERR : ", err);
                            reject(error);
                        })
                })
            }
            return Promise.reject(error);
        }
    )

    useEffect(() => {

        const getCsrfToken = async () => {

            const { data } = await axios.get("/api/csrf-token");
            console.log("Csrf : ", data);
            axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
        };

        getCsrfToken();

    }, [])

    return (

        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>

    )
}

export { Context, Provider };