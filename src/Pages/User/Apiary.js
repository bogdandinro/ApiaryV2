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
const Apiary = () => {
  // states for handling data
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [editid, setEditid] = useState("");

  const [apiary, setApiary] = useState([]);

  const [addshow, setaddShow] = useState(false);
  const [editshow, seteditShow] = useState(false);

  const handleaddClose = () => setaddShow(false);
  const handleeditClose = () => seteditShow(false);

  // open add popup modal
  const handleaddShow = () => {
    setName("");
    setLocation("");
    setaddShow(true);
  };

  // function for getting selected apiary data and open edit model with that data
  const handleeditShow = (id) => {
    setEditid(id);

    onValue(ref(db, "apiary/" + id), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setName(data.name);
        setLocation(data.location);
        seteditShow(true);
      }
    });
  };

  // function to add apiary
  const add = () => {
    const apiaryref = ref(db, "apiary/");
    const newApiary = {
      key: push(apiaryref).key,

      name: name,
      location: location,
      userid: user.uid,
    };
    set(ref(db, "apiary/" + newApiary.key), newApiary);
    handleaddClose();
    toast.success("Apiary Added Successfully");
  };

  // function for updating apiary

  const edit = () => {
    const apiaryref = ref(db, "apiary/" + editid);
    const newApiary = {
      key: editid,
      name: name,
      location: location,
      userid: user.uid,
    };

    set(apiaryref, newApiary);
    handleeditClose();
    toast.success("Apiary Updated Successfully");
  };
  // function for deleting apiary
  const deleteapiary = (id) => {
    const apiaryref = ref(db, "apiary/" + id);
    remove(apiaryref);
    toast.success("Apiary Deleted Successfully");
  };

  // function for go to hive page of selected apiary

  const gotohives = (id) => {
    navigate("/user/hives", { state: { apiaryid: id } });
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

            // if user is present then get apiary data from firebase

            onValue(ref(db, "apiary"), (snapshot) => {
              // check if there is data or not
              if (snapshot.exists()) {
                const data = snapshot.val();
                const propertyValues = Object.values(data);
                //if there is data convert it into array and save in state
                setApiary(propertyValues);
                setIsLoading(false);
              } else {
                setApiary([]);

                setIsLoading(false);
              }
            });
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    <h1>Manage Apiary</h1>
                    <button className="btn btn-primary" onClick={handleaddShow}>
                      Add New Apiary
                    </button>
                  </div>
                  <br />

                  {/* table rendering apiary data */}
                  <Table bordered responsive id="tt">
                    <thead>
                      <tr>
                        <th>Apiary Name</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiary.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{v.name}</td>
                            <td>{v.location}</td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => gotohives(v.key)}
                              >
                                View Hive
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

        {/* add apiary modal */}
        <Modal show={addshow} onHide={handleaddClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Apiary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Apiary Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

        {/* edit apiary modal */}

        <Modal show={editshow} onHide={handleeditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Apiary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Apiary Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

export default Apiary;
