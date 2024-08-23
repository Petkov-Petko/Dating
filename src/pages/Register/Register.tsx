import "./Register.scss";
import { useState } from "react";
import { signUp } from "../../service/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signUp(email, password, name);
      console.log("User created successfully");
      
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="form-container">
      <p className="title">Create account</p>
      <form className="form">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="input"
          placeholder="Name"
          value={name}
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input"
          placeholder="Email"
          value={email}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input"
          placeholder="Password"
          value={password}
        />

        <button onClick={(e)=> handleSignUp(e )} className="form-btn">Register</button>
      </form>

      <div className="buttons-container">
        <div className="google-login-button">
          <i className="fa-brands fa-google fa-xl"></i>
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
