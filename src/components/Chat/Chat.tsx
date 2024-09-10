import "./Chat.scss";
import { useState, useEffect, useRef } from "react";
import {
  getChat,
  getUser,
  listenForMessages,
  sendMessage,
} from "../../service/db-service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { calculateAge, calculateTimeDifference } from "../../service/utils";
import { message } from "../../types/types";


const Chat = () => {
  const { id: chatId = "" } = useParams<{ id: string }>();
  const uid = useSelector(
    (state: RootState) => state.data.user.user?.uid || ""
  );
  const [otherUser, setOtherUser] = useState({
    name: "",
    photo: "",
    age: 0,
  });
  const [allMessages, setAllMessages] = useState<message[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listenForMessages(chatId, (messages) => {
      setAllMessages(Object.values(messages || {}));
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    });

    const fetchChat = async () => {
      const chat = await getChat(chatId);
      const otherUserId = chat.participants.find((id: string) => id !== uid);
      const otherUser = await getUser(otherUserId);
      setOtherUser({
        name: `${otherUser.firstName} ${otherUser.lastName}`,
        photo: otherUser.profilePhoto,
        age: calculateAge(otherUser.birthDate),
      });

      setAllMessages(Object.values(chat.messages || {}));
    };
    fetchChat();

    console.log("listening for messages");
  }, [chatId]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [allMessages]);

  const send = async () => {
    console.log(message);

    const time = new Date().toISOString();
    await sendMessage(chatId, { sender: uid, text: message, date: time });
    setMessage("");
  };

  return (
    <div className="chat_container">
      <div className="chat_header">
        <i className="fa-solid fa-circle-arrow-left fa-2xl"></i>
        <h3>
          {otherUser.name}, {otherUser.age}
        </h3>
        <img src={otherUser.photo} alt="" />
      </div>
      <div className="chat_area" ref={chatAreaRef}>
        {allMessages?.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === uid ? "sent" : "received"
            }`}
          >
            {message.sender !== uid && <img src={otherUser.photo} alt="" />}
            <div>
              <p>{message.text}</p>
              <h4>{calculateTimeDifference(message.date)}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="chat_input">
        <div className="messageBox">
          <div className="fileUploadWrapper">
            <label htmlFor="file">
              <i className="fa-solid fa-image fa-xl"></i>
              <span className="tooltip">Add an image</span>
            </label>
            <input type="file" id="file" name="file" />
          </div>
          <textarea
            required
            placeholder="Message..."
            id="messageInput"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button id="sendButton" onClick={send}>
            <i className="fa-regular fa-paper-plane fa-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
