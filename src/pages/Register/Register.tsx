import "./Register.scss";

const Register = () => {
  return (
    <div className="form-container">
      <p className="title">Create account</p>
      <form className="form">
        <input type="email" className="input" placeholder="Email" />
        <input type="password" className="input" placeholder="Password" />

        <button className="form-btn">Register</button>
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
