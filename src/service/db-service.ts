import { database } from "../config/firebase-config";
import {
  ref,
  get,
  set,
  query,
  equalTo,
  orderByChild,
  update,
  child,
  push,
  onValue,
} from "firebase/database";
import { chat, Message, userCredentials, userDetails } from "../types/types";

/**
 * Creates a new user in the database.
 *
 * @param userDetails - The details of the user to be created.
 * @returns A Promise that resolves to the result of the database operation.
 */
export const createUser = async (userDetails: userCredentials) => {
  try {
    const userRef = ref(database, `users/${userDetails.uid}`);
    await set(userRef, userDetails);
    return userDetails;
  } catch (error) {
    console.log(error);
  }
};

export const checkIfUserExists = async (username: string, email: string) => {
  try {
    const snapshot1 = await get(
      query(ref(database, "users"), orderByChild("username"), equalTo(username))
    );
    const snapshot2 = await get(
      query(ref(database, "users"), orderByChild("email"), equalTo(email))
    );

    return [snapshot1, snapshot2];
  } catch (error) {
    console.log(error);
    return [null, null];
  }
};

export const getUser = async (uid: string) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const verifyUser = async (uid: string) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, { verified: true });
  } catch (error) {
    console.log(error);
  }
};

export const getVerifiedStatus = async (uid: string) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    return userData?.verified || false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const updateUserDetails = async (
  uid: string,
  details: Partial<userDetails>
) => {
  try {
    const userRef = ref(database, `users/${uid}`);

    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existingData = snapshot.val();

      const updatedData = {
        ...existingData,
        ...details,
      };

      await update(userRef, updatedData);
    } else {
      console.log("User does not exist.");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async () => {
  try {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const likeUser = async (
  userId: string,
  otherUserId: string,
  date: string
) => {
  try {
    const userRef = ref(database, `users/${userId}/likes`);
    await update(userRef, { [otherUserId]: date });
  } catch (error) {
    console.log(error);
  }
};


export const getLikesIds = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}/likes`);
    const snapshot = await get(userRef);
    const users = snapshot.val();

    if (!users) {
      return [];
    }

    return Object.keys(users);
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const createChat = async (userId: string, otherUserId: string) => {
  try {
    const chatId = userId < otherUserId ? `${userId}_${otherUserId}` : `${otherUserId}_${userId}`;
    const chatRef = ref(database, `chats/${chatId}`);

    const chatSnapshot = await get(child(ref(database), `chats/${chatId}`));
    if (!chatSnapshot.exists()) {
      await set(chatRef, { messages: [], id: chatId, participants: [userId, otherUserId], createdAt: new Date().toISOString() });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getChats = async (userId: string) => {
  try {
    const chatsRef = ref(database, "chats");
    const snapshot = await get(chatsRef);
    const chats = snapshot.val();

    if (!chats) {
      return [];
    }

    return Object.keys(chats).reduce((result: chat[], chatId) => {
      const chat = chats[chatId];
      if (chat.participants.includes(userId)) {
        result.push(chat);
      }
      return result;
    }, []);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getChat = async (chatId: string) => {
  try {
    const chatRef = ref(database, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (chatId: string, message: { sender: string; text: string; date: string, photo?: string }) => {
  try {
    const chatRef = ref(database, `chats/${chatId}/messages`);
    await push(chatRef, message);
  } catch (error) {
    console.log(error);
  }
}

export const listenForMessages = (chatId: string, callback: (messages: Message) => void) => {
  const chatRef = ref(database, `chats/${chatId}/messages`);
  onValue(chatRef, (snapshot) => {
    const messages = snapshot.val();
    callback(messages);
  });
};
