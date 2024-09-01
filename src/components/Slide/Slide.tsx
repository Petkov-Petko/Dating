import "./Slide.scss";
import { useState, useEffect } from "react";
import { getUser, getUsers } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userDetails } from "../../types/types";
import { calculateAge } from "../../service/utils";

const Slide = () => {
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const [user, setUser] = useState<userDetails | null>();
  const [usersToShow, setUsersToShow] = useState<userDetails[]>([]);
  const [userToShow, setUserToShow] = useState<userDetails | null>();
  const [userToShowPhotos, setUserToShowPhotos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextPhoto = () => {
    if (photoIndex < userToShowPhotos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setPhotoIndex(0);
    }
  };
  const prevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    } else {
      setPhotoIndex(userToShowPhotos.length - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const user = await getUser(userId);
        setUser(user);

        const usersAll = await getUsers();
        const users: userDetails[] = Object.values(usersAll);

        const maleUsers = users.filter((user) => user.gender === "male");
        const femaleUsers = users.filter((user) => user.gender === "female");

        if (user.gender === "male") {
          setUsersToShow(femaleUsers);
        } else {
          setUsersToShow(maleUsers);
        }

        const usersToShow = user.gender === "male" ? femaleUsers : maleUsers;
        if (usersToShow.length > 0) {
          const randomUser =
            usersToShow[Math.floor(Math.random() * usersToShow.length)];
          setUserToShow(randomUser);
          setUserToShowPhotos(randomUser.photos ?? []);
        }
      }
    };

    fetchData();
  }, [userId]);

  
  return (
    <div className="slide_container">
      <div className="slide">
        <img src={userToShowPhotos[photoIndex]} alt="user photos" />
        <div className="blur"></div>
        <div className="photo_arrows">
          <i onClick={prevPhoto} className="fa-solid fa-chevron-left fa-lg"></i>
          <i
            onClick={nextPhoto}
            className="fa-solid fa-chevron-right fa-lg"
          ></i>
        </div>
        <div className="slide_content">
          <div className="slide_top">
            <h1>{userToShow?.firstName}</h1>
            <p >{calculateAge(userToShow?.birthDate ?? "")}</p>
          </div>
          <div className="slide_middle">
            <p>Lives in: {userToShow?.city}</p>
          </div>
          <div className="slide_bottom">
            <p className="slide_bottom_bio">Bio:</p>
            <p>{userToShow?.title}</p>
          </div>
          <div className="slide_buttons">
            <button className="button_left"><i className="fa-solid fa-xmark fa-lg"></i></button>
            <button className="button_right"><i className="fa-solid fa-heart fa-lg "></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
