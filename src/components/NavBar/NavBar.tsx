import { useSelector } from "react-redux";
import "./NavBar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutUser, setVerified } from "../../features/userSlice";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const user = useSelector((state: RootState) => state.data.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogOut = () => {
    dispatch(logoutUser());
    signOut(getAuth());
    dispatch(setVerified(false));
  };
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("fa-ellipsis-vertical")) {
        setShowMenu((prevShowMenu) => !prevShowMenu);
      } else {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div className="nav_bar">
        <div>
          <img
            onClick={() => navigate("/")}
            className="logo"
            src={assets.logo}
            alt="logo"
          />
        </div>
        <div className="nav_bar_right">
          <img
            onClick={() => navigate(`/profile/${user?.uid}`)}
            src={user?.profilePhoto ? user?.profilePhoto : assets.userProfile}
            alt="user profile"
          />
          <p>{user?.username}</p>
          <i className="fa-solid fa-ellipsis-vertical fa-lg"></i>
        </div>
      </div>
      {showMenu && (
        <div className="options_menu">
          <div className="input">
            <div className="mobile_options">
              <button onClick={() => navigate("/mobile")} className="value">
                <i className="fa-solid fa-comment fa-lg"></i>Messages & Likes
              </button>
            </div>
            <button onClick={() => navigate("/settings")} className="value">
              <i className="fa-solid fa-gear fa-lg"></i>Settings
            </button>
            <button onClick={handleLogOut} className="value">
              <i className="fa-solid fa-right-from-bracket fa-lg"></i>
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
