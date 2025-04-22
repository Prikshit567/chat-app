import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () =>{

    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
  
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
    const handleSubmit = async e => {
      e.preventDefault();
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', formData);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        const token = res.data.token
        localStorage.setItem("token",token)
        navigate('/chat');
      } catch (err) {
        alert(err.response.data.msg);
      }
    };

    return(
      <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
        <button type='button' onClick={()=> navigate("/register")} style={{marginTop:"1rem"}}>Register Now, If dont have a account. </button>
      </form>
    </div>
    )
}

export default Login;
