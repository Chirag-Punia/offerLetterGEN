import React, { useEffect } from "react";
import HomePage from "./HomePage";
import Login from "./Login";
import DashBoard from "./DashBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { authState } from "../store/authState";
import axios from "axios";
import { Forgot } from "./Forgot";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OfferLetter from "./OfferLetter";
import UpdateDetails from "./UpdateDetails";
import { useNavigate } from "react-router-dom";

function App() {
  
  return (
    <RecoilRoot>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <InitState />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage>
                <Login />
              </HomePage>
            }
          />
          <Route
            path="/dashboard"
            element={
              <HomePage>
                <DashBoard />
              </HomePage>
            }
          />
          <Route
            path="/forgot"
            element={
              <HomePage>
                <Forgot />
              </HomePage>
            }
          />
          <Route
            path="/update-details/:uniqueId"
            element={
              <HomePage>
                <UpdateDetails />
              </HomePage>
            }
          />
          <Route
            path="/test"
            element={
              <HomePage>
                <PDFDownloadLink
                  document={<OfferLetter name={"Chirag"} position={"sde"} />}
                  fileName="OFFER-LETTER"
                >
                  <button>Download</button>
                </PDFDownloadLink>
              </HomePage>
            }
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

const InitState = () => {
  const base_url = "https://offerlettergen.onrender.com";
  const setAuth = useSetRecoilState(authState);
  const reactNavigator = useNavigate();
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      try {
        const config = {
          method: "GET",
          url: `${base_url}/auth/me`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios(config);
        const { data } = response;
        if (data.user) {
          setAuth({ token: data.token, user: data.user });
        } else {
          reactNavigator("/");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        
        reactNavigator("/");
      }
    };

    init();
  }, [setAuth]);

  return null;
};

export default App;
