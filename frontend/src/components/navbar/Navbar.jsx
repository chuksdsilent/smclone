import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const Navbar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext)
    const { currentUser } = useContext(AuthContext)
    const [menu, setMenu] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const [search, setSearch] = useState("");

    const mutation = useMutation(
        (newPost) => {
            return makeRequest.post("/auth/logout", newPost);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries(["posts"]);
            },
        }
    );

    const handleLogout = () => {
        mutation.mutate({ "userId": currentUser.id });
        localStorage.removeItem("user")
        navigate("/login")
    }
    const handleClick = () => {
        navigate("/search?search_item=" + search)
    }
    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: "none" }}><span>Oshabz Social</span></Link>
                <HomeOutlinedIcon />
                {darkMode ? (
                    <WbSunnyOutlinedIcon onClick={toggle} />
                ) : (
                    <DarkModeOutlinedIcon onClick={toggle} />
                )}
                <GridViewOutlinedIcon />
                <div className="search-content">
                    <div className="search">
                        <SearchOutlinedIcon />
                        <input type="text" onChange={(e) => setSearch(e.target.value)} name="search" placeholder="Search..." />
                    </div>
                    <input type="button" onClick={handleClick} value="Search" />

                </div>
            </div>
            <div className="right">
                <PersonOutlinedIcon />
                <EmailOutlinedIcon />
                <NotificationsOutlinedIcon />
                <div className="user" onClick={() => setMenu(!menu)}>
                    {currentUser.profilePic ? (<img src={currentUser.profilePic} alt="" />) : (<img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=360&t=st=1685786219~exp=1685786819~hmac=4ab5b571b447fc8574d6b2255f0dc0814dccac92a47963cfcff2e45ed7e88a45" alt="" />)}
                    <span>{currentUser.name}</span>
                </div>
                <div className="menu-position">
                    {menu ? (
                        <div className="sub-menu">
                            <Link to={`/profile/${currentUser.id}`} className="link">Profile</Link>
                            <Link onClick={handleLogout} className="link">Logout</Link>
                        </div>) : ""}
                </div>
            </div>
        </div>
    )
}

export default Navbar
