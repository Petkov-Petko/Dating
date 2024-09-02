import "./Slide.scss";
import { useState, useEffect } from "react";
import {
  getUser,
  getUsers,
  likeOrDislike,
  getLikedAndDislikedUsers,
} from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userDetails } from "../../types/types";
import { calculateAge } from "../../service/utils";
import Loading from "../Loading/Loading";
import PhotoIndicator from "../PhotoIndicator/PhotoIndicator";

const Slide = () => {
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const [usersToShow, setUsersToShow] = useState<userDetails[]>([]);
  const [userToShow, setUserToShow] = useState<userDetails | null>();
  const [userToShowPhotos, setUserToShowPhotos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [age, setAge] = useState(0);
  const [loading, setLoading] = useState(false);

  const nextPhoto = () => {
    setLoading(true);

    if (photoIndex < userToShowPhotos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setPhotoIndex(0);
    }
  };
  const prevPhoto = () => {
    setLoading(true);

    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    } else {
      setPhotoIndex(userToShowPhotos.length - 1);
    }
  };

  const likeOrSkip = async (
    userId: string,
    otherUserId: string,
    state: boolean
  ) => {
    await likeOrDislike(userId, otherUserId, state);

    const updatedUsersToShow = usersToShow.filter(
      (user) => user.uid !== otherUserId
    );
    setUsersToShow(updatedUsersToShow);

    if (updatedUsersToShow.length > 0) {
      const nextRandomUser =
        updatedUsersToShow[
          Math.floor(Math.random() * updatedUsersToShow.length)
        ];
      setUserToShow(nextRandomUser);
      setUserToShowPhotos(nextRandomUser.photos || []);
      setAge(
        nextRandomUser.birthDate ? calculateAge(nextRandomUser.birthDate) : 0
      );
    } else {
      setUserToShow(null);
      setUserToShowPhotos([]);
      setAge(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const user = await getUser(userId);

        const usersAll = await getUsers();
        const users: userDetails[] = Object.values(usersAll);

        const likedUsers = await getLikedAndDislikedUsers(userId);

        const filteredUsers = users.filter(
          (user) => !likedUsers.includes(user.uid)
        );

        const maleUsers = filteredUsers.filter(
          (user) => user.gender === "male"
        );

        const femaleUsers = filteredUsers.filter(
          (user) => user.gender === "female"
        );

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
          setAge(calculateAge(randomUser.birthDate ?? ""));
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setLoading(false);
  }, [photoIndex]);

  if (!userToShow) {
    return (
      <div className="noMoreUsers">
        <h1>No users to show</h1>
      </div>
    );
  }

  return (
    <div className="slide_container">
      <div className="slide">
      <PhotoIndicator totalPhotos={userToShowPhotos.length} currentIndex={photoIndex} /> {/* Add PhotoIndicator */}

        {loading ? (
          <Loading />
        ) : (
          <img
            src={userToShowPhotos[photoIndex]}
            alt={userToShow.firstName}
            onLoad={() => setLoading(false)}
          />
        )}
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
            <p>{age}</p>
          </div>
          <div className="slide_middle">
            <p>Lives in: {userToShow?.city}</p>
          </div>
          <div className="slide_bottom">
            <p className="slide_bottom_bio">BIO</p>
            <p>{userToShow?.title}</p>
          </div>
          <div className="slide_buttons">
            <button
              onClick={() => likeOrSkip(userId ?? "", userToShow.uid, false)}
              className="button_left"
            >
              <i className="fa-solid fa-xmark fa-lg"></i>
            </button>
            <button
              onClick={() => likeOrSkip(userId ?? "", userToShow.uid, true)}
              className="button_right"
            >
              <i className="fa-solid fa-heart fa-lg "></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
