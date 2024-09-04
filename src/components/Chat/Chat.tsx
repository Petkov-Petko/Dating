import "./Chat.scss";

const Chat = () => {
  return (
    <div className="chat_container">
      <div className="chat_header">
        <i className="fa-solid fa-circle-arrow-left fa-2xl"></i>
        <h3>Petko, 25</h3>
        <img src="https://via.placeholder.com/50" alt="" />
      </div>
      <div className="chat_area"></div>
      <div className="chat_input">
        <div className="box-input">
          <div className="border">
            <input
              type="text"
              name="text"
              className="input"
              placeholder="Name"
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
