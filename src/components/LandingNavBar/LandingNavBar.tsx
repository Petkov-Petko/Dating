import "./LandingNavBar.scss";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const LandingNavBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="landing_page_nav">
        <img src={assets.logo} alt="logo" />
        <div className="landing_page_nav_btn">
          <button
            onClick={() => navigate("/login")}
            className="landing_page_nav_btn_login"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="landing_page_nav_btn_signUp"
          >
            Sign up
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingNavBar;
