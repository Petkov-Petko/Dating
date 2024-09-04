import "./UserMessages.scss";

const UserMessages = () => {
  return (
    <div className="messages_container">
      <h1>Messages</h1>
      <div className="all_messages">
        <div className="single_message">
          <img src="https://via.placeholder.com/50" alt="" />
          <p>Petko Petkov</p>   
          <p>Last message</p>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
