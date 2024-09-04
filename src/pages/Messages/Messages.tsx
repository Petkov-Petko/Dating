import Chat from "../../components/Chat/Chat";
import SideBar from "../../components/SideBar/SideBar";
import "./Messages.scss";

const Messages = () => {
  return (
    <div className="messages">
      <SideBar />
      <Chat />
    </div>
  );
};

export default Messages;
