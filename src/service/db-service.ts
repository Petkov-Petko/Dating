import { database } from "../config/firebase-config";
import {
  ref,
  get,
  set,
  query,
  equalTo,
  orderByChild,
  update,
} from "firebase/database";
import { userCredentials, userDetails } from "../types/types";

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
export const updateUserDetails = async (uid: string, details: Partial<userDetails>) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existingData = snapshot.val();
      
      const updatedData = {
        ...existingData,
        ...details
      };
      
      await update(userRef, updatedData);
    } else {
      console.log("User does not exist.");
    }
  } catch (error) {
    console.log(error);
  }
}