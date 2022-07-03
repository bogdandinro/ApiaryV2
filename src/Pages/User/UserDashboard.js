// Importing Livraries
import React, { useState, useEffect } from "react";
import Header from "../../Components/header";
import Sidebar from "../../Components/sidebar";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  auth,
  onValue,
  ref,
  db,
} from "../../Config/firebase";

// main functional component
const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    //

    onAuthStateChanged(auth, (firebaseUser) => {
      // Check for user status
      if (firebaseUser === null) {
        navigate("/");
      } else {
        const userref = ref(db, "users/" + firebaseUser.uid);
        onValue(userref, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUser(data);

            setIsLoading(false);
          } else {
            navigate("/");
          }
        });
      }
    });
  }, [navigate]);

  // rendering user interface

  if (isLoading === true) {
    return (
      <>
        <div className="loadingscreen">
          <h2 className="mt-2" style={{ fontSize: "45px", color: "white" }}>
            Please Wait
          </h2>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div id="page-top" style={{ width: "min-content", minWidth: "100vw" }}>
          <div id="wrapper" style={{ backgroundColor: "#1D1942" }}>
            <Sidebar />

            <div className="d-flex flex-column" id="content-wrapper">
              <div id="content">
                <Header />
                <br />
                <div className="container-fluid">
                  {/* rendering username from state */}
                  <h1>Welcome {user.username}</h1>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default UserDashboard;
