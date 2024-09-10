import "./Profile.scss";
import { useState, useEffect, useRef } from "react";
import { getUser, updateUserDetails } from "../../service/db-service";
import { userDetails } from "../../types/types";
import { useParams } from "react-router-dom";
import { calculateAge, extractPhotoName } from "../../service/utils";
import { assets } from "../../assets/assets";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  uploadUserProfilePhoto,
  getUserProfilePhoto,
  uploadFiles,
  getFiles,
  removeFile,
} from "../../service/storage";

const Profile = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [user, setUser] = useState<userDetails | null>(null);
  const [age, setAge] = useState<number>(0);
  const uid = useSelector((state: RootState) => state.data.user.user?.uid);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>("");
  const [allPhotos, setAllPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    description: "",
    title: "",
    gender: "",
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const allPhotosInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handleAllPhotosClick = () => {
    if (allPhotosInputRef.current) {
      allPhotosInputRef.current.click();
    }
  };

  const handleProfileFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newProfilePhoto = URL.createObjectURL(file);
      setProfilePhoto(newProfilePhoto);
    }
  };

  const handleAddPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setAllPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setNewPhotos((prevPhotos) => [...prevPhotos, ...Array.from(files)]);
    }
  };

  const removePhoto = (index: number) => {
    setAllPhotos(allPhotos.filter((_, i) => i !== index));
    setNewPhotos(newPhotos.filter((_, i) => i !== index));
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
        gender: user?.gender,
      });
      setProfilePhoto(user?.profilePhoto);
      setAllPhotos(user?.photos ?? []);
    };

    fetchUser();
  }, [id]);

  const updateUser = async () => {
    if (user) {
      if (profilePhoto !== user.profilePhoto) {
        const file = photoInputRef.current?.files?.[0];
        if (file) {
          await uploadUserProfilePhoto(id, file);
          const url = await getUserProfilePhoto(id);
          setProfilePhoto(url);
        }
      }

      const removedPhotos = (user.photos ?? []).filter(
        (photo) => !allPhotos.includes(photo)
      );
      if (removedPhotos.length > 0) {
        if (allPhotos.length < 2) {
          alert("You must have at least two photo");
          return;
        }
        await Promise.all(
          removedPhotos.map((photo) => {
            const photoName = extractPhotoName(photo, id);
            return removeFile(id, photoName);
          })
        );

        const updatedPhotos = (user.photos ?? []).filter(
          (photo) => !removedPhotos.includes(photo)
        );
        await updateUserDetails(id, { photos: updatedPhotos });
        setAllPhotos(updatedPhotos);
      }

      if (newPhotos.length > 0) {
        await Promise.all(
          newPhotos.map((photo) => {
            return uploadFiles(id, photo, `photo${photo.name}${photo.size}`);
          })
        );

        const photosUrls = await getFiles(id);
        await updateUserDetails(id, { photos: photosUrls });
        setAllPhotos(photosUrls);
      }
      const updatedUser = {
        ...user,
        ...userDetails,
      };
      await updateUserDetails(id, userDetails);
      setUser(updatedUser);

      setEditMode(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile_header">
        <div className="profile_profile_photo">
          <img src={profilePhoto ?? ""} alt="profile photo" />
          {editMode && (
            <>
              <button
                className="profile_change_profile_btn"
                onClick={handleProfilePhotoClick}
              >
                Change Photo
              </button>
              <input
                type="file"
                style={{ display: "none" }}
                ref={photoInputRef}
                onChange={handleProfileFileChange}
              />
            </>
          )}
        </div>
        <div className="edit_profile">
          <button
            onClick={() => {
              if (!editMode) {
                setProfilePhoto(user?.profilePhoto ?? "");
                setAllPhotos(user?.photos ?? []);
              }
              setEditMode(!editMode);
            }}
          >
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
              {userDetails.firstName} {userDetails.lastName}
            </>
          )}
          , <span className="age">{age}</span>
          <img src={assets.verifiedLogo} alt="logo for verified users" />
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
            userDetails.title
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
              {userDetails.city}, {userDetails.country}
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
                  userDetails.gender === "male"
                    ? { color: "royalblue" }
                    : { color: "rgb(255, 49, 49)" }
                }
                className="fa-solid fa-venus-mars fa-lg"
              ></i>
              {userDetails.gender}
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
            userDetails.description
          )}
        </p>
        {uid !== id && <button> Like user</button>}
      </div>
      <div className="profile_photos_container">
        <div className="profile_photos_filter">
          <p>All </p>
          <p>
            Photos
            <span className="photos_length_span">{allPhotos.length}</span>
          </p>
          <p>Videos</p>
        </div>
        {editMode && (
          <button onClick={handleAllPhotosClick}>Add more photos</button>
        )}
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={allPhotosInputRef}
          onChange={handleAddPhotos}
        />
        <hr className="hr" />
        <div className="profile_photos">
          {allPhotos.map((photo, index) => {
            return (
              <div key={index} className="photo_container">
                <img src={photo} alt="user photo" />
                <span onClick={() => removePhoto(index)}>
                  <i className="fa-solid fa-x fa-xs"></i>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
