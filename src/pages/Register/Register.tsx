import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <p className="title">Create account</p>
      <form className="form">
        <input type="email" className="input" placeholder="Email" />
        <input type="password" className="input" placeholder="Password" />
        <p className="page-link">
          <span className="page-link-label">Forgot Password?</span>
        </p>
        <button className="form-btn">Register</button>
      </form>
      <p className="sign-up-label" >
          Already have an account?<span onClick={() => navigate("/login")} className="sign-up-link">Log in</span>
        </p>
      <div className="buttons-container">
        <div className="apple-login-button">
         
          <span>Log in with Apple</span>
        </div>
        <div className="google-login-button">
        <i className="fa-brands fa-google fa-xl"></i>
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
