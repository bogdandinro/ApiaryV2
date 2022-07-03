import React from "react";
import Login from "../Pages/Login.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "../Pages/User/UserDashboard.js";
import Apiary from "../Pages/User/Apiary.js";
import Workers from "../Pages/User/Workers.js";
import Hives from "../Pages/User/Hives.js";
import Tasks from "../Pages/User/Tasks.js";
import WorkerDashboard from "../Pages/Worker/WorkerDashboard.js";
import WorkerTasks from "../Pages/Worker/WorkerTasks.js";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/apiary" element={<Apiary />} />
        <Route path="/user/hives" element={<Hives />} />
        <Route path="/user/tasks" element={<Tasks />} />

        <Route path="/user/workers" element={<Workers />} />

        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/tasks" element={<WorkerTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
