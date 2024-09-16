import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase-config";

/**
 * Retrieves the appropriate Auth0 client ID based on the user's device.
 * 
 * @returns {string | undefined} The Auth0 client ID for mobile or desktop.
 * 
 * - If the user is on an iPhone, it returns the mobile client ID (`REACT_APP_AUTH0_MOBILE_CLIENT_ID`).
 * - Otherwise, it returns the desktop client ID (`REACT_APP_AUTH0_CLIENT_ID`).
 */
const getClientId = () => {
  if (navigator.userAgent.match(/iPhone/i)) {
    return import.meta.env.REACT_APP_AUTH0_MOBILE_CLIENT_ID; // Google SSO is disabled
  } else {
    return import.meta.env.REACT_APP_AUTH0_CLIENT_ID; // Google SSO is enabled
  }
};

/**
 * Sign up a user with the provided email address, password, and display name.
 *
 * @param emailAddress - The email address of the user.
 * @param password - The password of the user.
 * @param username - The display name of the user.
 * @returns A promise that resolves to the user credentials.
 */
export const signUp = async (
  emailAddress: string,
  password: string,
  username: string
) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      emailAddress,
      password
    );
    await signInWithEmailAndPassword(auth, emailAddress, password);
    if (userCredentials.user) {
      await updateProfile(userCredentials.user, {
        displayName: username,
      });
    }
    return userCredentials;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      alert("Email already exists");
    }
  }
};

/**
 * Signs in the user using Google authentication.
 * @returns An object containing the user's email and username if the sign-in is successful.
 */
export const googleSignIn = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    client_id: getClientId() || '',
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return {
      uid: user.uid,
      username: user.displayName,
      email: user.email,
    };
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return null;
  }
};

/**
 * Handles the deletion of the current user.
 *
 * @returns  A promise that resolves when the user is deleted.
 * @throws  If the current user is not found.
 */
export const handleUserDelete = async () => {
  try {
    if (auth.currentUser) {
      return await deleteUser(auth.currentUser);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Logs in a user with the provided email address and password.
 *
 * @param emailAddress - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to the user credentials.
 * @throws An error with the message 'Invalid email or password' if the login fails.
 */
export const logIn = async (emailAddress: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      emailAddress,
      password
    );
    return userCredentials;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Logs out the user.
 * @returns  A promise that resolves when the user is successfully logged out.
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};
