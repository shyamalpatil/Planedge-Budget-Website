import React from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const LandingPage = () => {
  const navbarStyle = {
    backgroundColor: "#2a3d77",
    color: "#ffffff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #a8b4d8",
  };

  const logoStyle = {
    height: "50px",
  };

  const navLinksStyle = {
    display: "flex",
    gap: "20px",
  };

  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s",
  };

  const heroSectionStyle = {
    position: "relative",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    textAlign: "center",
  };

  const heroContentStyle = {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(42, 61, 119, 0.8)",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  };

  const ctaButtonStyle = {
    backgroundColor: "#c4cde5",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s",
  };

  const footerStyle = {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#2a3d77",
    color: "#ffffff",
    marginTop: "20px",
  };

  return (
    <div>
      {/* Navbar */}
      <header style={navbarStyle}>
        <img src="/planedge-frontend/src/assets/Planedge logo.png" alt="Planedge Logo" style={logoStyle} />
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
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        {/* Background Animation */}
        <Spline
          scene="https://prod.spline.design/LPbDYXVqXVnveGnb/scene.splinecode"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        />
        {/* Hero Content */}
        <div style={heroContentStyle}>
          <h1 style={{ color: "#ffffff", fontSize: "36px" }}>Planedge Cost Estimation Tool</h1>
          <p style={{ color: "#ffffff", fontSize: "18px" }}>
            Estimate your construction costs in minutes
          </p>
          <Link to="/estimation">
            <button
              style={ctaButtonStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2a3d77")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#c4cde5")}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <p>© 2024 Planedge. All Rights Reserved.</p>
        <p>
          Contact:{" "}
          <a
            href="mailto:bd@planedge.in"
            style={{ color: "#c4cde5", textDecoration: "none" }}
          >
            bd@planedge.in
          </a>{" "}
          | CC:{" "}
          <a
            href="mailto:businessexcellence@planedge.in"
            style={{ color: "#c4cde5", textDecoration: "none" }}
          >
            businessexcellence@planedge.in
          </a>{" "}
          | Phone: +91 888-888-7891, +91 988-103-3222
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
