import "./Profile.scss";
import { useState, useEffect, useRef } from "react";
import { getUser, updateUserDetails } from "../../service/db-service";
import { userDetails } from "../../types/types";
import { useParams } from "react-router-dom";
import { calculateAge } from "../../service/utils";
import { assets } from "../../assets/assets";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  uploadUserProfilePhoto,
  getUserProfilePhoto,
} from "../../service/storage";

const Profile = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [user, setUser] = useState<userDetails | null>(null);
  const [age, setAge] = useState<number>(0);
  const uid = useSelector((state: RootState) => state.data.user.user?.uid);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>("");

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    description: "",
    title: "",
    photos: [],
    gender: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newProfilePhoto = URL.createObjectURL(file);
      setProfilePhoto(newProfilePhoto);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(id);
      setUser(user);
      setAge(calculateAge(user?.birthDate));
      setUserDetails({
        firstName: user?.firstName,
        lastName: user?.lastName,
        city: user?.city,
        country: user?.country,
        description: user?.description,
        title: user?.title,
        photos: user?.photos,
        gender: user?.gender,
      });
      setProfilePhoto(user?.profilePhoto);
    };
    console.log(uid);
    console.log(user?.profilePhoto);

    fetchUser();
  }, [id]);

  const updateUser = async () => {
    if (user) {
      if (profilePhoto !== user.profilePhoto) {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          await uploadUserProfilePhoto(id, file);
          const url = await getUserProfilePhoto(id);
          setProfilePhoto(url);
        }
      }
      const updatedUser = {
        ...user,
        ...userDetails,
      };
      await updateUserDetails(id, userDetails);
      console.log(userDetails);

      setUser(updatedUser);

      setEditMode(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile_header">
        <img src={user?.photos[2]} alt="" />
        <div className="profile_profile_photo">
          <img src={profilePhoto ?? ""} alt="" />
          {editMode && (
            <>
              <button className="profile_change_profile_btn" onClick={handleProfilePhotoClick}>Change Photo</button>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
        <div className="edit_profile">
          <button onClick={() => setEditMode(!editMode)}>
            <i className="fa-solid fa-user-pen fa-lg"></i>
            {editMode ? "Cancel" : "Edit profile"}
          </button>
          {editMode && (
            <button onClick={updateUser}>
              <i className="fa-solid fa-save fa-lg"></i>
              Save
            </button>
          )}
        </div>
      </div>
      <div className="profile_details">
        <h3>
          {editMode ? (
            <>
              <input
                type="text"
                value={userDetails.firstName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, firstName: e.target.value })
                }
              />
              <input
                type="text"
                value={userDetails.lastName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, lastName: e.target.value })
                }
              />
            </>
          ) : (
            <>
              {user?.firstName} {user?.lastName}
            </>
          )}
          , <span className="age">{age}</span>
          <img src={assets.verifiedLogo} alt="" />
        </h3>
        <p className="profile_details_title">
          {editMode ? (
            <input
              type="text"
              value={userDetails.title}
              onChange={(e) =>
                setUserDetails({ ...userDetails, title: e.target.value })
              }
            />
          ) : (
            user?.title
          )}
        </p>
        <div className="profile_details_flex">
          {editMode ? (
            <>
              <input
                value={userDetails.city}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, city: e.target.value })
                }
                type="text"
                placeholder="City"
              ></input>
              <input
                value={userDetails.country}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, country: e.target.value })
                }
                type="text"
                placeholder="Country"
              ></input>
            </>
          ) : (
            <p>
              <i
                className="fa-solid fa-map-pin fa-lg"
                style={{ color: "#fc4e4c" }}
              ></i>
              {user?.city}, {user?.country}
            </p>
          )}
          {editMode ? (
            <select
              value={userDetails.gender}
              onChange={(e) =>
                setUserDetails({ ...userDetails, gender: e.target.value })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <p>
              <i
                style={
                  user?.gender === "male"
                    ? { color: "royalblue" }
                    : { color: "rgb(255, 49, 49)" }
                }
                className="fa-solid fa-venus-mars fa-lg"
              ></i>
              {user?.gender}
            </p>
          )}
        </div>
        <p>
          {editMode ? (
            <textarea
              value={userDetails.description}
              onChange={(e) =>
                setUserDetails({ ...userDetails, description: e.target.value })
              }
            />
          ) : (
            user?.description
          )}
        </p>{" "}
        {uid !== id && <button> Like user</button>}
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
