import { googleSignIn, logIn } from "../../service/auth";
import { checkIfUserExists, createUser } from "../../service/db-service";
import "./Login.scss";
import { useState } from "react";
import { resetPassword } from "../../service/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordResetMessage, setPasswordResetMessage] = useState(false);

  const handleLogIn = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const login = await logIn(email, password);
      if (!login) {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const userDetails = await googleSignIn();
      if (userDetails?.username && userDetails?.email) {
        const [usernameSnapshot, emailSnapshot] = await checkIfUserExists(
          userDetails.username,
          userDetails.email
        );
        const userExists =
          (usernameSnapshot && usernameSnapshot.exists()) ||
          (emailSnapshot && emailSnapshot.exists());

        if (!userExists) {
          await createUser({
            uid: userDetails.uid,
            username: userDetails.username,
            email: userDetails.email,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleResetPassword = async () => {
    try {
      if (email === "") {
        setErrorMessage("Please enter your email address");
        return;
      }
      const reset = await resetPassword(email);
      if (reset === true) {
        setPasswordResetMessage(true);
        setErrorMessage("");
      } else if (reset === "Firebase: Error (auth/invalid-email).") {
        setErrorMessage("This email is not registered");
        setPasswordResetMessage(false);
      } else {
        setErrorMessage("Could not send password reset email");
        setPasswordResetMessage(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form">
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input"
          placeholder="Email"
          value={email}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input"
          placeholder="Password"
          value={password}
        />
        <p className="page-link">
          <span onClick={handleResetPassword} className="page-link-label">
            Forgot Password?
          </span>
        </p>
        {errorMessage !== "" && <p className="error_msg">{errorMessage}</p>}
        {passwordResetMessage && (
          <p id="reset_msg">Password reset email sent.</p>
        )}
        <button onClick={handleLogIn} className="form-btn">
          Log in
        </button>
      </form>

      <div className="buttons-container">
        <div onClick={handleGoogleSignIn} className="google-login-button">
          <i className="fa-brands fa-google fa-xl"></i>
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
