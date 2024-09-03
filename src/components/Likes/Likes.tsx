import "./Likes.scss";
import { getUsers, getUser } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useState, useEffect } from "react";
import { userDetails } from "../../types/types";
import { calculateTimeDifference } from "../../service/utils";

const Likes = () => {
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const [likes, setLikes] = useState<{ user: userDetails; date: string }[]>([]);

  useEffect(() => {
    const fetchLikes = async () => {
      const allUsers = Object.values(await getUsers()) as userDetails[];

      const likes = await Promise.all(
        allUsers
          .filter(
            (user: userDetails) =>
              user && user.likes && userId && user.likes[userId]
          )
          .map(async (user: userDetails) => {
            const userDetails = await getUser(user.uid);
            return {
              user: userDetails,
              date: user.likes && userId ? user.likes[userId] : "",
            };
          })
      );

      setLikes(likes);
    };
    fetchLikes();
  }, [userId]);

  return (
    <div className="like_container">
      {likes.map((like) => (
        <div key={like.user.uid} className="like">
          <img src={like.user.profilePhoto} alt="" />
          <h4>
            {like.user.firstName} {like.user.lastName}
          </h4>
          <p>Likes you {calculateTimeDifference(like.date)}</p>
        </div>
      ))}
    </div>
  );
};

export default Likes;
