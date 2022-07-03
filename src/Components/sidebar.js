// importing libraries
import React from "react";
import {
  CDBSidebar,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
  CDBSidebarContent,
  CDBSidebarMenu,
} from "cdbreact";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, signOut } from "../Config/firebase";
const Sidebar = () => {
  const navigate = useNavigate();

  // function for logout
  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert("Error signing out");
        console.log(error);
      });
  };

  // rendering user interface
  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#1D1942">
        <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
          Dashboard
        </CDBSidebarHeader>
        <CDBSidebarContent>
          <CDBSidebarMenu>
            <NavLink exact to="/user/dashboard">
              <CDBSidebarMenuItem icon="th-large" iconSize="md">
                Dashboard
              </CDBSidebarMenuItem>{" "}
            </NavLink>

            <NavLink exact to="/user/apiary">
              <CDBSidebarMenuItem icon="hamburger" iconSize="md">
                Apiary
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/user/workers">
              <CDBSidebarMenuItem icon="truck" iconSize="md">
                Workers
              </CDBSidebarMenuItem>
            </NavLink>

            <CDBSidebarMenuItem icon="door-open" iconSize="md" onClick={logout}>
              Logout
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
