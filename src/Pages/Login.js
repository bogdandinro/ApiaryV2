// Importing Libraries
import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../Config/firebase";
import { useNavigate } from "react-router-dom";
import { db, ref, set, onValue } from "../Config/firebase.js";
import { ToastContainer, toast } from "react-toastify";

// Main Functional Component
const HomePage = () => {
  // Declaring States for handling data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Regular User");

  // Declaring a variable for useNavigate()
  const navigate = useNavigate();

  // Function for Sign Up
  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        set(ref(db, "users/" + data.user.uid), {
          username: username,
          email: data.user.email,
          uid: data.user.uid,
        });
        toast.success("User Registered Successfully");
      })
      .catch((e) => {
        toast.error("Error! Please Try Again Later");
      });
  };

  // Function for Sign In
  const signin = () => {
    // Checking if the user is a worker or a regular user
    if (type === "Regular User") {
      signInWithEmailAndPassword(auth, email, password)
        .then((data) => {
          const userref = ref(db, "users/" + data.user.uid);
          onValue(userref, (snapshot) => {
            if (snapshot.exists()) {
              toast.success("User Signed In Successfully");
              navigate("/user/dashboard");
            }
          });
        })
        .catch((e) => {
          toast.error("Error! Please Try Again Later");
        });
    } else if (type === "Worker") {
      const userref = ref(db, "workers");
      onValue(userref, (snapshot) => {
        // Checking if the worker is in the database
        if (snapshot.exists()) {
          let arr = [];
          snapshot.forEach((data) => {
            const dataVal = data.val();

            if (dataVal.email === email && dataVal.password === password) {
              arr.push(dataVal);
            }
          });

          // if worker is not show error message
          if (arr.length === 0) {
            toast.error("Email or Password is Incorrect");
          } else if (arr.length === 1) {
            // if worker is in the database then create his profile in firebase auth
            createUserWithEmailAndPassword(auth, email, password)
              .then((data) => {
                setTimeout(() => {
                  // after success creating profile redirect to dashboard of worker
                  navigate("/worker/dashboard");
                }, 3000);
                toast.success("Worker Signed In Successfully");
              })
              .catch((e) => {
                var errorMessage = e.message;

                if (e.code === "auth/email-already-in-use") {
                  toast.info("Fetching Worker");

                  // if get error while creating profile because there is already a profile  then just sign in

                  signInWithEmailAndPassword(auth, email, password)
                    .then((data) => {
                      const userref = ref(db, "workers");
                      onValue(userref, (snapshot) => {
                        let ar = [];
                        // check if sign in user is worker or not
                        if (snapshot.exists()) {
                          snapshot.forEach((data) => {
                            const dd = data.val();

                            if (dd.email === email) {
                              ar.push(dd);
                            }
                          });

                          // if its worker then redirect to dashboard else show error
                          if (ar.length === 1) {
                            setTimeout(() => {
                              navigate("/worker/dashboard");
                            }, 3000);

                            toast.success("Worker Signed In Successfully");
                          } else {
                            toast.error("Invalid Login Credentials");
                          }
                        }
                      });
                    })
                    .catch((e) => {
                      toast.error("Error! Please Try Again Later");
                    });
                } else {
                  toast.error(errorMessage);
                }
              });
          }
        }
      });
    } else {
      toast.error("Error! Invalid User Type");
    }
  };

  // jsx code for rendering user interface
  return (
    <>
      <div className="authbody">
        <div className="authmain">
          <input type="checkbox" id="authchk" aria-hidden="true" />

          <div className="authsignup">
            <div className="authform">
              <label className="authlabel" htmlFor="authchk" aria-hidden="true">
                Login
              </label>
              <input
                className="authinput"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="authinput"
                type="password"
                name="pswd"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                className="authinput"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Regular User">Regular User</option>
                <option value="Worker">Worker</option>
              </select>

              <button className="authbutton" onClick={signin}>
                Login
              </button>
            </div>
          </div>

          <div className="authlogin">
            <div className="form">
              <label className="authlabel" htmlFor="authchk" aria-hidden="true">
                Sign up
              </label>
              <input
                className="authinput"
                type="text"
                name="txt"
                placeholder="User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="authinput"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="authinput"
                type="password"
                name="pswd"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="authbutton" onClick={signup}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default HomePage;
