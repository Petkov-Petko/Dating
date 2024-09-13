import "./Matches.scss";
import { useState, useEffect } from "react";
import { createChat, getLikesIds, getUser } from "../../service/db-service";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { userDetails } from "../../types/types";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const uid = useSelector((state: RootState) => state.data.user.user?.uid);
  const [matches, setMatches] = useState<userDetails[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const userLikes = await getLikesIds(uid ?? "");

      const matches = await Promise.all(
        userLikes.map(async (like) => {
          const userDetails = await getUser(like);
          if (userDetails.likes && uid && userDetails.likes[uid]) {
            await createChat(uid, userDetails.uid);
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
        {matches.length === 0 && (
          <p>
            Matches will show up here when you start liking people.
          </p>
        )}
        {matches.map((match) => (
          <div key={match.uid} className="chat">
            <img
              onClick={() => navigate(`/profile/${match.uid}`)}
              src={match.profilePhoto}
              alt=""
            />
            <h4 onClick={() => navigate(`/profile/${match.uid}`)}>
              {match.firstName} {match.lastName}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
