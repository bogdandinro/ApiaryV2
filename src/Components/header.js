import React from "react";

export const Header = (props) => {
  return (
    <div
      style={{
        backgroundColor: "#1D1942",
        height: "75px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginRight: "30px",
          }}
          className="htitle"
        >
          Welcome
        </h2>
      </div>
    </div>
  );
};

export default Header;
