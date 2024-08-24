import { useDispatch } from "react-redux";
import { assets } from "../../assets/assets";
import "./SetUpPhotos.scss";
import { AppDispatch, RootState } from "../../app/store";
import {  setVerified } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { verifyUser } from "../../service/db-service";

const SetUpPhotos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);

  const finish = async () => {
    await verifyUser(userId);
    dispatch(setVerified(true));
  };

  return (
    <div className="setUp_photos">
      <h1>Upload Your Photos</h1>
      <div>
        <img className="set_up_profile_photo" src={assets.userProfile} alt="" />
      </div>
      <div>
        <p className="add_photos">Add Photos</p>
        <div className="set_up_all_photos"></div>
      </div>
      <button onClick={finish}>Finish</button>
    </div>
  );
};

export default SetUpPhotos;
