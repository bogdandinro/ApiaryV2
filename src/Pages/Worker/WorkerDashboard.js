// importing libraries
import React, { useState, useEffect } from "react";
import Header from "../../Components/header";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  auth,
  onValue,
  ref,
  db,
} from "../../Config/firebase";
import WorkerSidebar from "../../Components/workersidebar";

// main functional component
const WorkerDashbaord = () => {
  // states for handling data
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
        const userref = ref(db, "workers");
        onValue(userref, (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((data) => {
              const dataVal = data.val();

              if (dataVal.email === firebaseUser.email) {
                setUser(dataVal);

                // check if user is in database or not and set isLoading to false

                setIsLoading(false);
              }
            });
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
            <WorkerSidebar />

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

export default WorkerDashbaord;
