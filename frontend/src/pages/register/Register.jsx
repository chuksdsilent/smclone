import React, { useState } from 'react'
import "./register.scss"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
const Register = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
    });
    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const data = await axios.post("http://localhost:8800/api/auth/register", inputs);
            navigate("/login?msg=Account created successfully. Kindly login")
        } catch (err) {
            setErr(err.response.data);
        }
    };
    return (
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Oshabz Social</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente doloremque sequi voluptatum quasi et, labore veritatis! Labore quam quod rerum quisquam ullam, odio itaque similique necessitatibus eius cum voluptatem iste.
                    </p>
                    <span>Do you have an account</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">

                    <h1 className="mobile-header">
                        Oshabz <br /> <span>Social</span>
                    </h1>
                    <h1>Register</h1>
                    <form action="">
                        <input type="text" placeholder='Username' name="username" onChange={handleChange} />
                        <input type="password" placeholder='password' name='password' onChange={handleChange} />
                        <input type="email" placeholder='email' name='email' onChange={handleChange} />
                        <input type="text" placeholder='Name' name='name' onChange={handleChange} />
                        {err && err}
                        <div className="show-button">

                            <button onClick={handleClick}>Register</button>
                            <div className="mobile-button">

                                <Link to="/login">
                                    <button>Login</button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register