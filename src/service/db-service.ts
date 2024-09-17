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

/**
 * Checks if a user exists in the database by username or email.
 *
 * @param {string} username - The username to check for existence.
 * @param {string} email - The email to check for existence.
 * @returns  A promise that resolves to an array containing two DataSnapshots:
 * - The first snapshot corresponds to the username query result.
 * - The second snapshot corresponds to the email query result.
 * If an error occurs, both elements in the array will be `null`.
 */
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

/**
 * Retrieves user data from the database based on the provided user ID.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns  A promise that resolves to the user data if found, or `null` if not found.
 * @throws Will log an error to the console if the database retrieval fails.
 */
export const getUser = async (uid: string) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Verifies a user by updating their verified status in the database.
 *
 * @param uid - The unique identifier of the user to verify.
 * @returns A promise that resolves when the user's verified status has been updated.
 * @throws Will log an error to the console if the update operation fails.
 */
export const verifyUser = async (uid: string) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, { verified: true });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves the verified status of a user from the database.
 *
 * @param {string} uid - The unique identifier of the user.
 * @returns {Promise<boolean>} - A promise that resolves to the verified status of the user.
 *                               Returns `false` if the user is not verified or if an error occurs.
 */
export const getVerifiedStatus = async (uid: string): Promise<boolean> => {
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

/**
 * Updates the details of a user in the database.
 *
 * @param uid - The unique identifier of the user.
 * @param details - An object containing the partial details of the user to be updated.
 *
 * @returns A promise that resolves when the user details are successfully updated.
 *
 * @throws Will log an error message if the update operation fails.
 */
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

/**
 * Retrieves the list of users from the database.
 *
 * @returns  A promise that resolves to the list of users.
 * @throws Will log an error to the console if the retrieval fails.
 */
export const getUsers = async () => {
  try {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Asynchronously likes a user by updating the likes of the specified user in the database.
 *
 * @param userId - The ID of the user who is liking another user.
 * @param otherUserId - The ID of the user being liked.
 * @param date - The date when the like action occurred.
 * @returns A promise that resolves when the like action is completed.
 * @throws Will log an error to the console if the update operation fails.
 */
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

/**
 * Retrieves the IDs of users that the specified user has liked.
 *
 * @param userId - The ID of the user whose likes are to be retrieved.
 * @returns A promise that resolves to an array of user IDs that the specified user has liked.
 *          If no likes are found or an error occurs, an empty array is returned.
 *
 * @throws Will log an error to the console if the retrieval process fails.
 */
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

/**
 * Creates a chat between two users if it does not already exist.
 *
 * @param userId - The ID of the first user.
 * @param otherUserId - The ID of the second user.
 * @returns A promise that resolves when the chat is created or already exists.
 *
 * @remarks
 * The chat ID is generated by concatenating the user IDs in alphabetical order.
 * If the chat does not exist, it initializes the chat with an empty messages array,
 * the chat ID, the participants' IDs, and the creation timestamp.
 *
 * @throws Will log an error to the console if the operation fails.
 */
export const createChat = async (userId: string, otherUserId: string) => {
  try {
    const chatId =
      userId < otherUserId
        ? `${userId}_${otherUserId}`
        : `${otherUserId}_${userId}`;
    const chatRef = ref(database, `chats/${chatId}`);

    const chatSnapshot = await get(child(ref(database), `chats/${chatId}`));
    if (!chatSnapshot.exists()) {
      await set(chatRef, {
        messages: [],
        id: chatId,
        participants: [userId, otherUserId],
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves the list of chats for a given user.
 *
 * @param userId - The ID of the user whose chats are to be retrieved.
 * @returns A promise that resolves to an array of chat objects in which the user is a participant.
 *          If no chats are found or an error occurs, an empty array is returned.
 *
 * @throws Will log an error to the console if the database retrieval fails.
 */
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

/**
 * Retrieves chat data from the database for a given chat ID.
 *
 * @param {string} chatId - The unique identifier of the chat to retrieve.
 * @returns  A promise that resolves to the chat data, or `null` if no data is found.
 * @throws Will log an error to the console if the retrieval fails.
 */
export const getChat = async (chatId: string) => {
  try {
    const chatRef = ref(database, `chats/${chatId}`);
    const snapshot = await get(chatRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Sends a message to a specific chat.
 *
 * @param chatId - The ID of the chat to which the message will be sent.
 * @param message - The message object containing the sender, text, date, and optionally a photo.
 * @param message.sender - The sender of the message.
 * @param message.text - The text content of the message.
 * @param message.date - The date when the message was sent.
 * @param [message.photo] - An optional photo URL associated with the message.
 * @returns A promise that resolves when the message is successfully sent.
 * @throws Will log an error to the console if the message sending fails.
 */
export const sendMessage = async (
  chatId: string,
  message: { sender: string; text: string; date: string; photo?: string }
) => {
  try {
    const chatRef = ref(database, `chats/${chatId}/messages`);
    await push(chatRef, message);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listens for new messages in a specific chat and invokes a callback with the messages.
 *
 * @param chatId - The unique identifier of the chat to listen to.
 * @param callback - A function to be called with the messages when they are updated.
 */
export const listenForMessages = (
  chatId: string,
  callback: (messages: Message) => void
) => {
  const chatRef = ref(database, `chats/${chatId}/messages`);
  onValue(chatRef, (snapshot) => {
    const messages = snapshot.val();
    callback(messages);
  });
};
