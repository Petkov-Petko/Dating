import "./Likes.scss";
import { getUsers } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useState, useEffect } from "react";
import { userDetails } from "../../types/types";

const Likes = () => {
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);
  const [likesIds, setLikesIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchLikes = async () => {
      const allUsers = Object.values(await getUsers()) as userDetails[];
          
      const likes = allUsers
        .filter((user: userDetails) => user && user.likes && userId && user.likes[userId])
        .map((user: userDetails) => user.uid);
    
      setLikesIds(likes);
      console.log(likes);
    };
    fetchLikes();
  }, [userId]);

  return <div>likes</div>;
};

export default Likes;
