import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const navBarStyle = {
    backgroundColor: "#2a3d77", // Base Blue Color
    color: "#ffffff", // White text
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "2px solid #a8b4d8", // Border Color
  };

  const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const logoStyle = {
    height: "50px",
    marginRight: "20px",
  };

  return (
    <header style={navBarStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/planedge-frontend/src/assets/Planedge logo.png"
          alt="Planedge Logo"
          style={logoStyle}
        />
        <nav style={navLinksStyle}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/features" style={linkStyle}>
            Features
          </Link>
          <Link to="/contact" style={linkStyle}>
            Contact Us
          </Link>
          <Link to="/login" style={linkStyle}>
            Login/Signup
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
