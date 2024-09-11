import "./Likes.scss";
import { getUsers, getUser } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useState, useEffect } from "react";
import { userDetails } from "../../types/types";
import { calculateTimeDifference } from "../../service/utils";
import { useNavigate } from "react-router-dom";

const Likes = () => {
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const [likes, setLikes] = useState<{ user: userDetails; date: string }[]>([]);
  const navigate = useNavigate();

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
      console.log(likes);
      
      setLikes(likes);
    };
    fetchLikes();
  }, [userId]);

  return (
    <div className="like_container">
      {likes.map((like) => (
        <div key={like.user.uid} className="like">
          <img onClick={()=> navigate(`/profile/${like.user.uid}`)} src={like.user.profilePhoto} alt="" />
          <h4 onClick={()=> navigate(`/profile/${like.user.uid}`)}>
            {like.user.firstName} {like.user.lastName}
          </h4>
          <p>Likes you {calculateTimeDifference(like.date)}</p>
        </div>
      ))}
    </div>
  );
};

export default Likes;
