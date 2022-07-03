// importing libraries
import React, { useState, useEffect } from "react";
import Header from "../../Components/header";
import Sidebar from "../../Components/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
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
const Hives = () => {
  // states for handling data
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [apiaryid, setApiaryid] = useState("");

  const location = useLocation();

  const [age, setAge] = useState("");
  const [statusofshape, setStatusofshape] = useState("");

  const [editid, setEditid] = useState("");

  const [hives, setHives] = useState([]);

  const [addshow, setaddShow] = useState(false);
  const [editshow, seteditShow] = useState(false);

  const handleaddClose = () => setaddShow(false);
  const handleeditClose = () => seteditShow(false);

  // open add hive popup modal
  const handleaddShow = () => {
    setAge("");
    setStatusofshape("");
    setaddShow(true);
  };

  // get selected hive data and open edit modal with that data
  const handleeditShow = (id) => {
    setEditid(id);

    onValue(ref(db, "hives/" + id), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setAge(data.age);
        setStatusofshape(data.statusofshape);
        seteditShow(true);
      }
    });
  };

  // function for add new hive
  const add = () => {
    if (parseInt(age) < 1) {
      toast.error("Age Should Be Greater Than 0");
    } else {
      const hiveref = ref(db, "hives/");
      const newHive = {
        key: push(hiveref).key,
        age: age,
        statusofshape: statusofshape,
        apiaryid: apiaryid,
      };
      set(ref(db, "hives/" + newHive.key), newHive);
      handleaddClose();
      toast.success("Hive Added Successfully");
    }
  };

  // function for edit the selected hive
  const edit = () => {
    const hiveref = ref(db, "hives/" + editid);
    const newHive = {
      key: editid,
      age: age,
      statusofshape: statusofshape,
      apiaryid: apiaryid,
    };

    set(hiveref, newHive);
    handleeditClose();
    toast.success("Hive Updated Successfully");
  };

  // function for deleting the selected hive
  const deletehive = (id) => {
    const hiveref = ref(db, "hives/" + id);
    remove(hiveref);
    toast.success("Hive Deleted Successfully");
  };

  useEffect(() => {
    // check if we get apiary id to get its hives
    if (location.state === null) {
      // if not go to apiary page
      navigate("/user/apiary");
    } else {
      // if yes then save it inside the state
      setApiaryid(location.state.apiaryid);

      onAuthStateChanged(auth, (firebaseUser) => {
        // Check for user status
        if (firebaseUser === null) {
          navigate("/");
        } else {
          const userref = ref(db, "users/" + firebaseUser.uid);

          // after we get the user then get all hives of the selected apiary
          onValue(userref, (snapshot) => {
            if (snapshot.exists()) {
              onValue(ref(db, "hives"), (snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  const propertyValues = Object.values(data);

                  const filtered = propertyValues.filter(
                    (item) => item.apiaryid === location.state.apiaryid
                  );

                  // after getting the hives, convert it into array and save it inside state

                  setHives(filtered);
                  setIsLoading(false);
                } else {
                  setHives([]);

                  setIsLoading(false);
                }
              });
            }
          });
        }
      });
    }

    //
  }, [navigate, location.state]);

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
                    <h1>Manage Hives</h1>
                    <button className="btn btn-primary" onClick={handleaddShow}>
                      Add New Hive
                    </button>
                  </div>
                  <br />
                  {/* table for showing all hive data */}
                  <Table bordered responsive id="tt">
                    <thead>
                      <tr>
                        <th>Age</th>
                        <th>Status Of Shape</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hives.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{v.age}</td>
                            <td>{v.statusofshape}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => handleeditShow(v.key)}
                              >
                                Edit
                              </button>
                              &nbsp; &nbsp;
                              <button
                                className="btn btn-danger"
                                onClick={() => deletehive(v.key)}
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

        {/* add hive modal */}
        <Modal show={addshow} onHide={handleaddClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Hive</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status Of Shape</label>
              <input
                type="number"
                className="form-control"
                value={statusofshape}
                onChange={(e) => setStatusofshape(e.target.value)}
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

        {/* edit hive modal */}
        <Modal show={editshow} onHide={handleeditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Hive</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status Of Shape</label>
              <input
                type="number"
                min={1}
                max={10}
                className="form-control"
                value={statusofshape}
                onChange={(e) => setStatusofshape(e.target.value)}
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

export default Hives;
