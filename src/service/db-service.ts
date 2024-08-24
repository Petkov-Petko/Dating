import { database } from "../config/firebase-config";
import {
  ref,
  get,
  set,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { userCredentials } from "../types/types";

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
