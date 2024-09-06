import "./Profile.scss";
import { useState, useEffect } from "react";
import { getUser } from "../../service/db-service";
import { userDetails } from "../../types/types";
import { useParams } from "react-router-dom";
import { calculateAge } from "../../service/utils";
import { assets } from "../../assets/assets";
const Profile = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [user, setUser] = useState<userDetails | null>(null);
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(id);
      setUser(user);
      setAge(calculateAge(user?.birthDate));
    };

    fetchUser();
  }, [id]);

  return (
    <div className="profile">
      <div className="profile_header">
        <img src={user?.photos[2]} alt="" />
        <div className="profile_profile_photo">
          <img src={user?.profilePhoto} alt="" />
        </div>
      </div>
      <div className="profile_details">
        <h3>
          {user?.firstName} {user?.lastName}, <span className="age">{age}</span> 
          <img src={assets.verifiedLogo} alt="" />

        </h3>
        <p className="profile_details_title">{user?.title}</p>
        <div className="profile_details_flex">
          <p>
            <i
              className="fa-solid fa-map-pin fa-lg"
              style={{ color: "#fc4e4c" }}
            ></i>
            {user?.city}, {user?.country}
          </p>
          <p>
            <i style={user?.gender === "male" ? {color: "royalblue"} : {color: "rgb(255, 49, 49)"}} className="fa-solid fa-venus-mars fa-lg"></i>
            {user?.gender}
          </p>
        </div>
        <p>{user?.description}</p>
        <button> Like user</button>
      </div>
      <div className="profile_photos_container">
        <div className="profile_photos_filter">
          <p>All </p>
          <p>
            Photos{" "}
            <span className="photos_length_span">{user?.photos?.length}</span>
          </p>
          <p>Videos</p>
        </div>
        <hr className="hr" />
        <div className="profile_photos">
          {user?.photos?.map((photo, index) => (
            <img key={index} src={photo} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
