import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { loginUser, setLoading, setVerified } from "./features/userSlice";
import { AppDispatch, RootState } from "./app/store";
import { getUser} from "./service/db-service";
import PublicHome from "./pages/PublicHome/PublicHome";
import SetUpAccount from "./pages/SetUpAccount/SetUpAccount";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home/Home";

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
        dispatch(
          loginUser({
            uid: user.uid,
            username: user.displayName,
            email: user.email,
          })
        );
        dispatch(setLoading(false));

        const userDetails = await getUser(user.uid)
        console.log(userDetails);
        
        if (userDetails.verified) {
          dispatch(setVerified(true));
        }else{
          dispatch(setVerified(false));
        }
      } else {
        dispatch(setLoading(false));
        console.log("No user is signed in");
      }
    });
  }, []);

  return (
    <BrowserRouter>
      {isLoading ? (
        <h1>Loading...</h1>
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
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
