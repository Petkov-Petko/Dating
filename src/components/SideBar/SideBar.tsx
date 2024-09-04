import Likes from "../Likes/Likes";
import Matches from "../Matches/Matches";
import UserMessages from "../UserMessages/UserMessages";
import "./SideBar.scss";
import { useState } from "react";

const SideBar = () => {
  const [filter, setFilter] = useState("likes");

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.checked ? "matches" : "likes");
  };

  return (
    <div className="side_bar">
      <UserMessages />
      <div className="side_bar_bottom">
        <p>Likes & Matches</p>
        <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
          <input
            type="checkbox"
            id="filter"
            onChange={handleCheckboxChange}
            checked={filter === "matches"}
          />
          <span>Likes</span>
          <span>Matches</span>
        </label>
        <div>{filter === "likes" ? <Likes /> : <Matches />}</div>
      </div>
    </div>
  );
};

export default SideBar;
