import './Login.scss';


const Login = () => {


  return (
    <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form">
        <input type="email" className="input" placeholder="Email" />
        <input type="password" className="input" placeholder="Password" />
        <p className="page-link">
          <span className="page-link-label">Forgot Password?</span>
        </p>
        <button className="form-btn">Log in</button>
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

export default Login;