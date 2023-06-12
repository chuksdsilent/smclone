import React, { useContext, useState } from 'react'
import "./login.scss"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
const Login = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [err, setErr] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const msg = searchParams.get("msg")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate("/")
        } catch (err) {
            setErr(err.response.data)
        }
    };

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Oshabz Social.</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
                        alias totam numquam ipsa exercitationem dignissimos, error nam,
                        consequatur.
                    </p>
                    <span>Don't you have an account?</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">

                    <h1 className="mobile-header">
                        Oshabz <br /> <span>Social</span>
                    </h1>
                    <h1>Login</h1>
                    {msg ? msg : ""}
                    <form>
                        <input type="text" placeholder="Username" name='username' onChange={handleChange} />
                        <input type="password" placeholder="Password" name='password' onChange={handleChange} />
                        <div className="show-button">
                            {err && err}
                            <button onClick={handleLogin}>Login</button>
                            <div className="mobile-button">
                                <Link to="/register" style={{ backgroundColor: "##f35959" }}>
                                    <button>Register</button>
                                </Link>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login