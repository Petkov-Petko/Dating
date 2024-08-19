import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase-config.js';


/**
 * Sign up a user with the provided email address, password, and display name.
 * 
 * @param emailAddress - The email address of the user.
 * @param password - The password of the user.
 * @param displayName - The display name of the user.
 * @returns A promise that resolves to the user credentials.
 */
export const signUp = async (emailAddress: string, password: string, displayName: string) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, emailAddress, password);
        if (userCredentials.user) {
            await updateProfile(userCredentials.user, {
                displayName: displayName,
            });
        }
        return userCredentials;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if(error.code === 'auth/email-already-in-use') {
            alert("Email already exists");
        }
    }
}

/**
 * Handles the deletion of the current user.
 * 
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 * @throws {Error} If the current user is not found.
 */
export const handleUserDelete = async () => {
    try {
        if (auth.currentUser) {
            return await deleteUser(auth.currentUser);
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.log(error);
    }
}


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
        const userCredentials = await signInWithEmailAndPassword(auth, emailAddress, password);
        return userCredentials;
    } catch (error) {
        console.log(error);
        throw new Error('Invalid email or password');
    }
}

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
}

/**
 * Signs in the user using Google authentication.
 * @returns An object containing the user's email and username if the sign-in is successful.
 */
export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (user) {
            return {
              email: user.email,
              username: user.displayName,
            };
          }
      } catch (error) {
        console.log(error);
      }
}