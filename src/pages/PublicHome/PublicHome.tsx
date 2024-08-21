import Login from "../Login/Login";
import Register from "../Register/Register";
import "./PublicHome.scss";
import { useState } from "react";

const PublicHome = () => {
  const [active, setActive] = useState("login");

  const handleActive = () => {
    if (active === "login") {
      setActive("register");
    } else {
      setActive("login");
    }
  };

  return (
    <div className="publicHome">
      <div>
        <img src="https://via.placeholder.com/550" alt="" />
      </div>
      <div>
        {active === "login" ? (<Login />) : (<Register />)}
        {active === "login" ? (
          <p className="sign-up-label">
            Don't have an account?<span onClick={handleActive} className="sign-up-link">Sign up</span>
          </p>
        ) : (
          <p className="sign-up-label">
            Already have an account?<span onClick={handleActive}  className="sign-up-link">Log in</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicHome;
