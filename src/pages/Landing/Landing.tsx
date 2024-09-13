import "./Landing.scss";
import { assets } from "../../assets/assets";
import { useState } from "react";
import LandingNavBar from "../../components/LandingNavBar/LandingNavBar";

const Landing = () => {
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  return (
    <div className="landing_page_container">
      <LandingNavBar />
      <div className="landing_page_middle">
        <div className="landing_page_middle_left">
          <h1>
            Dating <span>for every</span>
            <br />
            single person
          </h1>
          <p className="landing_page_middle_left_description">
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
