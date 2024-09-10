import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { loginUser, setLoading, setVerified } from "./features/userSlice";
import { AppDispatch, RootState } from "./app/store";
import { getUser } from "./service/db-service";
import PublicHome from "./pages/PublicHome/PublicHome";
import SetUpAccount from "./pages/SetUpAccount/SetUpAccount";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home/Home";
import Loading from "./components/Loading/Loading";
import Chat from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";

function App() {
  const user = useSelector((state: RootState) => state.data.user.user);
  const verified = useSelector((state: RootState) => state.data.user.verified);
  const isLoading = useSelector(
    (state: RootState) => state.data.user.isLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userDetails = await getUser(user.uid);
        dispatch(
          loginUser({
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            profilePhoto: user.photoURL,
          })
        );

        if (userDetails.verified) {
          dispatch(setVerified(true));
        } else {
          dispatch(setVerified(false));
        }
      } else {
        dispatch(setLoading(false));
        console.log("No user is signed in");
      }
      dispatch(setLoading(false));
    });
  }, []);

  return (
    <BrowserRouter>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user && <NavBar />}
          <Routes>
            <Route
              path="/"
              element={
                !user ? <PublicHome /> : !verified ? <SetUpAccount /> : <Home />
              }
            />
            <Route
              path="/messages/:id"
              element={
                !user ? <PublicHome /> : !verified ? <SetUpAccount /> : <Chat />
              }
            />
              <Route
              path="/profile/:id"
              element={
                !user ? <PublicHome /> : !verified ? <SetUpAccount /> : <Profile />
              }
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
