import { useSelector } from "react-redux";
import "./NavBar.scss";
import { AppDispatch, RootState } from "../../app/store";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/userSlice";

const NavBar = () => {
    const user = useSelector((state: RootState) => state.data.user.user);
    const dispatch = useDispatch<AppDispatch>();
    const handleLogOut = () => {
        dispatch(logoutUser());
        signOut(getAuth());
    };
    
  return (
    <div>
      <div>
        <img src="https://via.placeholder.com/50" alt="" />
        <p>{user?.username}</p>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  )
}

export default NavBar
