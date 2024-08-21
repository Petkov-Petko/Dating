import "./PublicNavBar.scss";
import { useNavigate } from "react-router-dom";

const PublicNavBar = () => {
    const navigate = useNavigate();

  return (
    <div className="public_nav_bar">
      <div>
        <img src="https://via.placeholder.com/150" alt="Placeholder Image" />
      </div>
      <div>
        <button onClick={()=>navigate("/login")}>Login</button>
        <button>Sign Up</button>
      </div>
    </div>
  );
};

export default PublicNavBar;
