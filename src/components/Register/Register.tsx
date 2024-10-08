import "./Register.scss";
import { useState } from "react";
import { googleSignIn, signUp } from "../../service/auth";
import { checkIfUserExists, createUser } from "../../service/db-service";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (!name || !email || !password) {
        setErrorMessage("Please fill all fields");
        return;
      } else if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        return;
      }

      const [usernameExists, emailExists] =
        (await checkIfUserExists(name, email)) || [];
      if (usernameExists && !usernameExists.exists()) {
        if (emailExists && !emailExists.exists()) {
          const userCredential = await signUp(email, password, name);
          const user = userCredential?.user;
          if (user) {
            const userDetails = {
              uid: user.uid,
              username: name,
              email: user.email,
            };
            await createUser({
              uid: userDetails.uid,
              username: userDetails.username,
              email: userDetails.email || "",
            });
            console.log("User created successfully");
          }
        } else {
          alert("Email already exists");
        }
      } else {
        alert("Username already exists");
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

  return (
    <div className="form-container">
      <p className="title">Create account</p>
      <form className="form">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="input"
          placeholder="Name"
          value={name}
        />
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
        {errorMessage.length > 0 && <p className="error_msg">{errorMessage}</p>}

        <button onClick={handleSignUp} className="form-btn">
          Register
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

export default Register;
