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
  const [photos, setPhotos] = useState<File[]>([]);

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

  const handleInputClick = () => {
    fileInput.current?.click();
  };
  console.log(photos);

  return (
    <div className="setUp_photos">
      <h1>Upload Your Photos</h1>
      <div>
        <img className="set_up_profile_photo" src={assets.userProfile} alt="" />
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
          {photos.map((photo)=> {
            return <img src={URL.createObjectURL(photo)} alt="" />;
          })}
        </div>
      </div>
      <button onClick={finish}>Finish</button>
    </div>
  );
};

export default SetUpPhotos;
