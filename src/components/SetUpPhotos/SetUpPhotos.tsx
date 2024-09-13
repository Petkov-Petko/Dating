import { useDispatch, useSelector } from "react-redux";
import { assets } from "../../assets/assets";
import "./SetUpPhotos.scss";
import { AppDispatch, RootState } from "../../app/store";
import { loginUser, setVerified } from "../../features/userSlice";
import { verifyUser, updateUserDetails } from "../../service/db-service";
import { useRef, useState } from "react";
import {
  uploadUserProfilePhoto,
  uploadFiles,
  getFiles,
  getUserProfilePhoto,
} from "../../service/storage";
import Loading from "../Loading/Loading";
import { getAuth, updateProfile } from "firebase/auth";

const SetUpPhotos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const fileInput = useRef<HTMLInputElement>(null);
  const profilePhotoInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    if (photos.length < 2) {
      alert("Please upload at least 2 photos");
      return;
    }
    if (!userId) {
      alert("User ID is undefined");
      return;
    }
    if (!profilePhoto) {
      alert("Please upload a profile photo");
      return;
    }
    setLoading(true);

    await uploadUserProfilePhoto(userId, profilePhoto);
    await Promise.all(
      photos.map((photo, index) => uploadFiles(userId, photo, `photo${index}`))
    );

    const photosUrls = await getFiles(userId);
    const profilePhotoUrl = await getUserProfilePhoto(userId);

    await updateUserDetails(userId, {
      photos: photosUrls,
      profilePhoto: profilePhotoUrl,
    });

    await verifyUser(userId);
    dispatch(setVerified(true));

    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        await updateProfile(user, {
          photoURL: profilePhotoUrl,
        });
        dispatch(
          loginUser({
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            profilePhoto: profilePhotoUrl,
          })
        );
      }
    });
    setLoading(false);
  };

  const addPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: File[] = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleSetProfilePhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setProfilePhoto(files[0]);
    }
  };

  const handleInputClick = () => {
    fileInput.current?.click();
  };

  const handleProfilePhotoClick = () => {
    profilePhotoInput.current?.click();
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="setUp_photos">
      {loading && <Loading />}

      <h1>Upload Your Photos</h1>
      <div>
        <input
          ref={profilePhotoInput}
          style={{ display: "none" }}
          type="file"
          onChange={handleSetProfilePhoto}
        ></input>
        <img
          onClick={handleProfilePhotoClick}
          className="set_up_profile_photo"
          src={
            profilePhoto
              ? URL.createObjectURL(profilePhoto)
              : assets.userProfile
          }
          alt=""
        />
      </div>
      <div>
        <div className="add_profile_photos">
          <input
            ref={fileInput}
            style={{ display: "none" }}
            type="file"
            multiple
            onChange={addPhotos}
          ></input>
          <div className="add_photos_button_div">
            <button onClick={handleInputClick} className="add_photos">
              Add profile photos
            </button>
            <i onClick={handleInputClick} className="fa-solid fa-circle-plus fa-2xl"></i>
          </div>
        </div>
        <div className="set_up_all_photos">
          {photos.map((photo, index) => {
            return (
              <div key={index} className="photo_container">
                <img src={URL.createObjectURL(photo)} alt="" />
                <span
                  className="remove_photo"
                  onClick={() => removePhoto(index)}
                >
                  X
                </span>
              </div>
            );
          })}
          {Array.from({ length: 2 - photos.length }).map((_, index) => (
            <div className="photo_container" key={index}>
              <div className="photo_layout">
                <i
                  onClick={handleInputClick}
                  className="fa-solid fa-plus fa-2xl"
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="finish_set_up_button" onClick={finish}>
        Finish
      </button>
    </div>
  );
};

export default SetUpPhotos;
