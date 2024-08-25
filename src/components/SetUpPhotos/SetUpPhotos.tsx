import { useDispatch, useSelector } from "react-redux";
import { assets } from "../../assets/assets";
import "./SetUpPhotos.scss";
import { AppDispatch, RootState } from "../../app/store";
import { setVerified } from "../../features/userSlice";
import { verifyUser } from "../../service/db-service";
import { useRef, useState } from "react";

const SetUpPhotos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const fileInput = useRef<HTMLInputElement>(null);
  const profilePhotoInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const finish = async () => {
    await verifyUser(userId);
    dispatch(setVerified(true));
  };

  const addPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: File[] = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleSetProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <h1>Upload Your Photos</h1>
      <div>
      <input
          ref={profilePhotoInput}
          style={{ display: "none" }}
          type="file"
          onChange={handleSetProfilePhoto}
        ></input>
        <img onClick={handleProfilePhotoClick} className="set_up_profile_photo" src={profilePhoto? URL.createObjectURL(profilePhoto) : assets.userProfile} alt="" />
      </div>
      <div>
        <input
          ref={fileInput}
          style={{ display: "none" }}
          type="file"
          multiple
          onChange={addPhotos}
        ></input>
        <p onClick={handleInputClick} className="add_photos">
          Add Photos
        </p>
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
        </div>
      </div>
      <button onClick={finish}>Finish</button>
    </div>
  );
};

export default SetUpPhotos;
