// importing libraries
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
  push,
  remove,
  set,
} from "../../Config/firebase";
import { Button, Modal, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

// main functional component
const Workers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [editid, setEditid] = useState("");

  const [workers, setWorkers] = useState([]);

  const [addshow, setaddShow] = useState(false);
  const [editshow, seteditShow] = useState(false);

  const handleaddClose = () => setaddShow(false);
  const handleeditClose = () => seteditShow(false);

  // open add popup modal
  const handleaddShow = () => {
    setUsername("");
    setEmail("");
    setaddShow(true);
  };

  // function for getting selected worker data and open edit model with that data
  const handleeditShow = (id) => {
    setEditid(id);

    onValue(ref(db, "workers/" + id), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsername(data.username);
        setEmail(data.email);
        seteditShow(true);
      }
    });
  };

  // function to add worker
  const add = () => {
    const workersref = ref(db, "workers/");
    const newWorker = {
      key: push(workersref).key,

      username: username,
      email: email,
      password: password,
      userid: user.uid,
    };
    set(ref(db, "workers/" + newWorker.key), newWorker);
    handleaddClose();
    toast.success("Worker Added Successfully");
  };

  // function for updating worker
  const edit = () => {
    const workersref = ref(db, "workers/" + editid);
    const newWorker = {
      key: editid,
      username: username,
      email: email,
      userid: user.uid,
    };

    set(workersref, newWorker);
    handleeditClose();
    toast.success("Worker Updated Successfully");
  };

  // function to delete worker
  const deleteapiary = (id) => {
    const workerref = ref(db, "workers/" + id);
    remove(workerref);
    toast.success("Worker Deleted Successfully");
  };

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

            // after getting the user get all workers data
            onValue(ref(db, "workers"), (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                const propertyValues = Object.values(data);
                // after getting data set it inside the state
                let arr = [];
                propertyValues.map((item) => {
                  if (item.userid === firebaseUser.uid) {
                    arr.push(item);
                  }
                });
                setWorkers(arr);
                setIsLoading(false);
              } else {
                setWorkers([]);

                setIsLoading(false);
              }
            });
          }
        });
      }
    });
  }, [navigate]);

  // goto to tasks page with the id of selected worker
  const gototasks = (id) => {
    navigate("/user/tasks", { state: { workerid: id } });
  };

  // rendering the user interface
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    <h1>Manage Workers</h1>
                    <button className="btn btn-primary" onClick={handleaddShow}>
                      Add New Worker
                    </button>
                  </div>
                  <br />

                  {/* table to show worker data */}
                  <Table bordered responsive id="tt">
                    <thead>
                      <tr>
                        <th>Worker UserName</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{v.username}</td>
                            <td>{v.email}</td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => gototasks(v.key)}
                              >
                                View Tasks
                              </button>
                              &nbsp; &nbsp;
                              <button
                                className="btn btn-primary"
                                onClick={() => handleeditShow(v.key)}
                              >
                                Edit
                              </button>
                              &nbsp; &nbsp;
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteapiary(v.key)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        {/* add worker popup modal */}
        <Modal show={addshow} onHide={handleaddClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Worker</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Worker UserName</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleaddClose}>
              Close
            </Button>
            <Button variant="primary" onClick={add}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* edit worker popup modal */}
        <Modal show={editshow} onHide={handleeditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Worker</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Worker UserName</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleeditClose}>
              Close
            </Button>
            <Button variant="primary" onClick={edit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
      </>
    );
  }
};

export default Workers;
