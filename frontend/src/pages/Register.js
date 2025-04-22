import axios from "axios";
import react, { useState } from "react"
import { useNavigate } from "react-router-dom"
import './Register.css'; 

const Register = () => {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", formData);
            if (response.status === 200) {
                navigate("/");
                console.log("done")
            }
        } catch (error) {
            console.log(error, "error")
        }
    };

    console.log(formData,"eee")
    return (
        <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>
            <input
                name="username"
                type="text"
                placeholder="Enter your name"
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
            />
            <button type="submit">Register</button>
            <button type="button" onClick={()=> navigate("/")} style={{marginTop:"1rem"}}>Already have a account</button>
        </form>
    </div>
    )
}

export default Register;
