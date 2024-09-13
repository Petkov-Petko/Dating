import "./UserMessages.scss";
import { getChats, getUser } from "../../service/db-service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { chat } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface chatDetails {
  id: string;
  otherUserPhoto: string;
  otherUserName: string;
  lastMessage: string;
}

const UserMessages = () => {
  const navigate = useNavigate();
  const uid = useSelector((state: RootState) => state.data.user.user?.uid);
  const [chatDetails, setChatDetails] = useState<chatDetails[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const userChats = await getChats(uid ?? "");

      const chatDetailsPromises = userChats.map(async (chat: chat) => {
        const otherUserId = chat.participants.find(
          (participant: string) => participant !== uid
        );
        if (otherUserId) {
          const otherUser = await getUser(otherUserId);
          const messages = chat.messages ? Object.values(chat.messages) : [];
          const lastMessage =
            chat.messages && messages.length > 0
              ? messages[messages.length - 1]
              : null;

          return {
            id: chat.id,
            otherUserPhoto: otherUser.profilePhoto,
            otherUserName: `${otherUser.firstName} ${otherUser.lastName}`,
            lastMessage: lastMessage
              ? lastMessage.sender !== uid
                ? lastMessage.text
                : "No new messages"
              : "No messages",
          };
        }
      });

      const chatDetails = (await Promise.all(chatDetailsPromises)).filter(
        (chat) => chat !== undefined
      );
      setChatDetails(chatDetails);
    };

    fetchChats();
  }, [uid]);

  return (
    <div className="messages_container">
      <h1>Messages</h1>
      <hr />
      <div className="all_messages">
        {chatDetails.length === 0 && (
          <p>
            When you match with someone you will be able to start a
            conversation.
          </p>
        )}
        {chatDetails.map((chat, index) => (
          <div
            onClick={() => navigate(`/messages/${chat.id}`)}
            className="single_message"
            key={index}
          >
            <img src={chat.otherUserPhoto} alt="" />
            <h4>{chat.otherUserName}</h4>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMessages;
