import "./Landing.scss";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="landing_page_container">
      <div className="landing_page_nav">
        <img src={assets.logo} alt="logo" />
        <div className="landing_page_nav_btn">
          <button onClick={()=> navigate("/login")} className="landing_page_nav_btn_login">Login</button>
          <button onClick={()=> navigate("/register")} className="landing_page_nav_btn_signUp">
            Sign up
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
        </div>
      </div>
      <div className="landing_page_middle">
        <div className="landing_page_middle_left">
          <h1>
            Dating <span>for every</span>
            <br />
            single person
          </h1>
          <p>
            Swipe through connections, spark real stories—because every great
            love starts with a match!
          </p>

          <div className="app_download">
            <a
              onClick={() => setErrorMessage(true)}
              href="#"
              className="playstore-button"
            >
              <span className="icon">
                <i className="fa-brands fa-apple fa-2xl"></i>
              </span>
              <span className="texts">
                <span className="text-1">Download form</span>
                <span className="text-2">App store</span>
              </span>
            </a>
            <a
              onClick={() => setErrorMessage(true)}
              href="#"
              className="playstore-button"
            >
              <span className="icon">
                <i className="fa-brands fa-android fa-2xl"></i>{" "}
              </span>
              <span className="texts">
                <span className="text-1">Download</span>
                <span className="text-2">Android Store</span>
              </span>
            </a>
          </div>
          {errorMessage && (
            <p className="development_msg">
              The application is still in development please be patient!
            </p>
          )}
        </div>
        <div className="landing_page_middle_right">
          <img src={assets.Landing} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
