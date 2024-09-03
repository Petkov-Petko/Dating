import "./Matches.scss";
import { useState, useEffect } from "react";
import { getLikesIds, getUser } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userDetails } from "../../types/types";

const Matches = () => {
  const uid = useSelector((state: RootState) => state.data.user.user?.uid);
  const [matches, setMatches] = useState<userDetails[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const userLikes = await getLikesIds(uid ?? "");

      const matches = await Promise.all(
        userLikes.map(async (like) => {
          const userDetails = await getUser(like);
          if (userDetails.likes && uid && userDetails.likes[uid]) {
            return userDetails;
          }
          return null;
        })
      );

      const filteredMatches = matches.filter((match) => match !== null);
      setMatches(filteredMatches);
    };

    fetchMatches();
  }, [uid]);

  return (
    <div>
      <div className="like_container">
        {matches.map((match) => (
          <div key={match.uid} className="like">
            <img src={match.profilePhoto} alt="" />
            <h4>
              {match.firstName} {match.lastName}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
