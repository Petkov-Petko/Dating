import { useSelector } from "react-redux";
import "./NavBar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutUser, setVerified } from "../../features/userSlice";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const user = useSelector((state: RootState) => state.data.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleLogOut = () => {
        dispatch(logoutUser());
        signOut(getAuth());
        dispatch(setVerified(false));
    };
    
  return (
    <div className="nav_bar">
      <div>
        <img onClick={()=>navigate("/")} className="logo" src={assets.logo} alt="" />
      </div>
      <div className="nav_bar_right">
        <img onClick={()=> navigate("/profile")} src={user?.profilePhoto ? user?.profilePhoto : assets.userProfile} alt="" />
        <p>{user?.username}</p>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  )
}

export default NavBar
