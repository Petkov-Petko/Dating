import { useSelector } from "react-redux";
import "./NavBar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutUser, setVerified } from "../../features/userSlice";

const NavBar = () => {
    const user = useSelector((state: RootState) => state.data.user.user);
    const dispatch = useDispatch<AppDispatch>();
    const handleLogOut = () => {
        dispatch(logoutUser());
        signOut(getAuth());
        dispatch(setVerified(false));
    };
    
  return (
    <div className="nav_bar">
      <div>
        <img src="https://via.placeholder.com/90" alt="" />
      </div>
      <div className="nav_bar_right">
        <img src="https://via.placeholder.com/50" alt="" />
        <p>{user?.username}</p>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  )
}

export default NavBar
