// importing libraries
import React, { useState, useEffect } from "react";
import Header from "../../Components/header";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  auth,
  onValue,
  ref,
  set,
  db,
} from "../../Config/firebase";
import { Table } from "react-bootstrap";
import WorkerSidebar from "../../Components/workersidebar";
import { ToastContainer, toast } from "react-toastify";

// main functional component
const WorkerTasks = () => {
  // states for handling data
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

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
                // after getting the worker, get all tasks of thtat worker
                onValue(ref(db, "tasks"), (snapshot) => {
                  if (snapshot.exists()) {
                    const data = snapshot.val();
                    const propertyValues = Object.values(data);

                    const filtered = propertyValues.filter(
                      (item) => item.workerid === dataVal.key
                    );

                    // after getting the tasks, save them in state
                    setTasks(filtered);
                    setIsLoading(false);
                  } else {
                    setTasks([]);

                    setIsLoading(false);
                  }
                });

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

  // function for confirm the task
  const confirm = (id, heading, description, workerid) => {
    const taskref = ref(db, "tasks/" + id);
    const newTask = {
      key: id,
      heading: heading,
      description: description,
      workerid: workerid,
      status: "Completed",
    };

    set(taskref, newTask);
    toast.success("Task Updated Successfully");
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
            <WorkerSidebar />

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
                  </div>
                  <br />
                  {/* table for showing tasks data */}
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
                            {/* redering button on confirm if the status is pending */}
                            <td>
                              {v.status === "pending" ? (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    confirm(
                                      v.key,
                                      v.heading,
                                      v.description,
                                      v.workerid
                                    )
                                  }
                                >
                                  Confirm Task
                                </button>
                              ) : (
                                <b>This Task Is Completed</b>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <br />{" "}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
};

export default WorkerTasks;
