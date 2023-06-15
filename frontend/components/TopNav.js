import { Menu } from "antd";
import {
    AppstoreOutlined,
    LoginOutlined,
    UserAddOutlined,
    LogoutOutlined,
    CoffeeOutlined,
    CarryOutOutlined,
    TeamOutlined
} from "@ant-design/icons"

const { Item, SubMenu, ItemGroup } = Menu // Menu.Item

// Next Js and React Js libraries
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";


import { Context } from "../context";
import { toast } from "react-toastify";

function TopNav() {

    const [current, setCurrent] = useState("");
    const { state, dispatch } = useContext(Context);
    const router = useRouter();

    const { user } = state;

    console.log("user : ", user);


    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname])

    const logout = async () => {

        // 1).Set global state to the logout
        dispatch({ type: "LOGOUT" });

        // 2).Empty the local storage
        window.localStorage.removeItem("user");

        const response = await axios.get("/api/logout")

        console.log("Response after logout request : ", response);

        // Logout message at the top
        toast(response.data.message);

        // 4).Redirecting to the login page after logout
        router.push("/login");
    }


    return (
        <Menu mode="horizontal" selectedKeys={[current]}>

            <Item
                icon={<AppstoreOutlined></AppstoreOutlined>}
                key="/"
                onClick={(e) => { setCurrent(e.key) }}>

                <Link href="/">
                    App
                </Link>
            </Item>


            {/* IF THE USER IS INSTRUCTOR AND ELSE IF NOT INSTRUCTOR */}
            {
                user && user.role && user.role.includes("Instructor") ? (
                    <Item
                        icon={<CarryOutOutlined></CarryOutOutlined>}
                        key="/instructor/course/create"
                        onClick={(e) => { setCurrent(e.key) }}>

                        <Link href="/instructor/course/create">
                            Create Course
                        </Link>
                    </Item>

                )
                    :
                    (
                        <Item
                            icon={<TeamOutlined></TeamOutlined>}
                            key="/user/become-instructor"
                            onClick={(e) => { setCurrent(e.key) }}>

                            <Link href="/user/become-instructor">
                                Become Instructor
                            </Link>
                        </Item>
                    )}


            {/* IF THE USER IS INSTRUCTOR AND ELSE IF NOT INSTRUCTOR */}
            {
                user && user.role && user.role.includes("Instructor") && (
                    <Item
                        icon={<TeamOutlined />}
                        key="/instructor"
                        className="float-right"
                        onClick={(e) => { setCurrent(e.key) }}>

                        <Link href="/instructor">
                            Instructor
                        </Link>
                    </Item>

                )
            }

            {/* If user is null(means not logged in ) then show login and register page */}

            {
                user === null && (
                    <>
                        <Item
                            icon={<LoginOutlined></LoginOutlined>}
                            key="/login"
                            onClick={(e) => { setCurrent(e.key) }}>

                            <Link href="/login">
                                Login
                            </Link>
                        </Item>

                        <Item
                            icon={<UserAddOutlined></UserAddOutlined>}
                            key="/register"
                            onClick={(e) => { setCurrent(e.key) }}>

                            <Link href="/register">
                                Register
                            </Link>
                        </Item>

                    </>
                )
            }

            {/* If user is not null */}
            {
                user !== null && (
                    <SubMenu
                        key="sub-menu"
                        icon={<CoffeeOutlined></CoffeeOutlined>}
                        title={user && user.name}
                        className="float-right">

                        <ItemGroup>

                            {/* Dash-board */}

                            <Item key="/user"
                                className="float-right">
                                <Link href="/user">
                                    Dashboard
                                </Link>
                            </Item>

                            {/* Log-out */}

                            <Item key="logout"
                                onClick={logout}
                                className="float-right">
                                Logout
                            </Item>

                        </ItemGroup>

                    </SubMenu>
                )
            }
        </Menu >
    )
}

export default TopNav