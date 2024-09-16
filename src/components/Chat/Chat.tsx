import "./Chat.scss";
import { useState, useEffect, useRef } from "react";
import {
  getChat,
  getUser,
  listenForMessages,
  sendMessage,
} from "../../service/db-service";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { calculateAge, calculateTimeDifference } from "../../service/utils";
import { Message } from "../../types/types";
import { uploadChatImage } from "../../service/storage";

const Chat = () => {
  const navigate = useNavigate();
  const { id: chatId = "" } = useParams<{ id: string }>();
  const uid = useSelector(
    (state: RootState) => state.data.user.user?.uid || ""
  );
  const [otherUser, setOtherUser] = useState({
    name: "",
    photo: "",
    age: 0,
    id: "",
  });
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

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
        id: otherUserId,
      });

      setAllMessages(Object.values(chat.messages || {}));
    };

    fetchChat();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chatId, uid]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleNavigation = () => {
    if (isMobile) {
      navigate("/mobile");
    } else {
      navigate("/");
    }
  };

  const send = async () => {
    if (message.trim() === "") return;

    const time = new Date().toISOString();
    await sendMessage(chatId, { sender: uid, text: message, date: time });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleSendPhotoClick = () => {
    if (photoRef.current) {
      photoRef.current.click();
    }
  };

  const sendPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const photoUrl = await uploadChatImage(chatId, e.target.files[0]);
      await sendMessage(chatId, {
        sender: uid,
        text: "",
        date: new Date().toISOString(),
        photo: photoUrl,
      });
    }
  };

  return (
    <div className="chat_container">
      <div className="chat_header">
        <i
          onClick={handleNavigation}
          className="fa-solid fa-circle-arrow-left fa-2xl"
        ></i>
        <h3>
          {otherUser.name}, {otherUser.age}
        </h3>
        <img
          onClick={() => navigate(`/profile/${otherUser.id}`)}
          src={otherUser.photo}
          alt="User profile photo"
        />
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
              {message.text !== "" ? (
                              <p>{message.text}</p>
              ) : (
                <img id="chat_image" src={message.photo} alt="" />
              )}
              <h4>{calculateTimeDifference(message.date)}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className="chat_input">
        <div className="messageBox">
          <div className="fileUploadWrapper">
            <label htmlFor="file">
              <i onClick={handleSendPhotoClick} className="fa-solid fa-image fa-xl"></i>
              <span>Add an image</span>
            </label>
            <input onChange={sendPhoto} ref={photoRef} type="file" name="file" />
          </div>
          <textarea
            required
            placeholder="Message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            value={message}
          />
          <button onClick={send}>
            <i className="fa-regular fa-paper-plane fa-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
