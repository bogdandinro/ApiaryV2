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
const Tasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [workerid, setWorkerid] = useState("");

  const location = useLocation();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  const [editid, setEditid] = useState("");

  const [tasks, setTasks] = useState([]);

  const [addshow, setaddShow] = useState(false);
  const [editshow, seteditShow] = useState(false);

  const handleaddClose = () => setaddShow(false);
  const handleeditClose = () => seteditShow(false);

  // open add popup modal
  const handleaddShow = () => {
    setHeading("");
    setDescription("");
    setaddShow(true);
  };

  // get selected task data and open edit modal with that data
  const handleeditShow = (id) => {
    setEditid(id);

    onValue(ref(db, "tasks/" + id), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setHeading(data.age);
        setDescription(data.statusofshape);
        seteditShow(true);
      }
    });
  };

  // function for add new task
  const add = () => {
    const taskref = ref(db, "tasks/");
    const newTask = {
      key: push(taskref).key,
      heading: heading,
      description: description,
      workerid: workerid,
      status: "pending",
    };
    set(ref(db, "tasks/" + newTask.key), newTask);
    handleaddClose();
    toast.success("Task Added Successfully");
  };

  // function for edit the selected task
  const edit = () => {
    const taskref = ref(db, "tasks/" + editid);
    const newTask = {
      key: editid,
      heading: heading,
      description: description,
      workerid: workerid,
      status: "pending",
    };

    set(taskref, newTask);
    handleeditClose();
    toast.success("Task Updated Successfully");
  };

  // function for delete the selected task
  const deletehive = (id) => {
    const taskref = ref(db, "tasks/" + id);
    remove(taskref);
    toast.success("Task Deleted Successfully");
  };

  useEffect(() => {
    // check if there is workert id or not
    if (location.state === null) {
      // if not then navigate to workers page
      navigate("/user/workers");
    } else {
      // if yes then save it inside the state
      setWorkerid(location.state.workerid);

      onAuthStateChanged(auth, (firebaseUser) => {
        // Check for user status
        if (firebaseUser === null) {
          navigate("/");
        } else {
          const userref = ref(db, "users/" + firebaseUser.uid);

          // after getting user , get all tasks data
          onValue(userref, (snapshot) => {
            if (snapshot.exists()) {
              onValue(ref(db, "tasks"), (snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val();
                  const propertyValues = Object.values(data);

                  const filtered = propertyValues.filter(
                    (item) => item.workerid === location.state.workerid
                  );

                  // after getting all tasks save it inside the state

                  setTasks(filtered);
                  setIsLoading(false);
                } else {
                  setTasks([]);

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
                    <h1>Manage Tasks</h1>
                    <button className="btn btn-primary" onClick={handleaddShow}>
                      Add New Task
                    </button>
                  </div>
                  <br />

                  {/* rendering tasks data in table */}
                  <Table bordered responsive id="tt">
                    <thead>
                      <tr>
                        <th>Heading</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{v.heading}</td>
                            <td>{v.description}</td>
                            <td>{v.status}</td>
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
        {/* add task popup modal */}
        <Modal show={addshow} onHide={handleaddClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Heading</label>
              <input
                type="text"
                className="form-control"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                style={{ width: "100%", height: "200px" }}
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

        {/* edit task popup modal */}
        <Modal show={editshow} onHide={handleeditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Heading</label>
              <input
                type="text"
                className="form-control"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                style={{ width: "100%", height: "200px" }}
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

export default Tasks;
