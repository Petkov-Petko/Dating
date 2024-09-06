import "./Profile.scss";

const Profile = () => {
  return (
    <div className="profile">
      <div className="profile_header">
        <img src="https://via.placeholder.com/550" alt="" />
        <div className="profile_profile_photo">
          <img src="https://via.placeholder.com/50" alt="" />
        </div>
      </div>
      <div className="profile_details">
        <h3>Petko Petkov, 25</h3>
        <p>Some title to show here</p>
        <div className="profile_details_flex">
          <p>Varna, Bulgaria</p>
          <p>Male</p>
        </div>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus
          debitis eius impedit commodi dolores. Tempora velit odio eligendi
          fugit voluptate, ipsum modi vel dolorum sunt ab, incidunt libero eum
          voluptatem?
        </p>
        <button>Like</button>
      </div>
      <div className="profile_photos_container">
        <div className="profile_photos_filter">
          <p>All</p>
          <p>Photos</p>
          <p>Videos</p>
        </div>
        <div className="profile_photos">
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
          <img src="https://via.placeholder.com/550" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
