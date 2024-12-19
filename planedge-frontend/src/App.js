import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your components/pages
import LandingPage from "./components/LandingPage"; // Updated Landing Page
import EstimationForm from "./components/EstimationForm"; // Cost Estimation Tool Page
import CostBreakdownChart from "./components/CostBrakdownCharts"; // Result Page with Pie Chart
import SignIn from "./SignIn"; // Login Page
import SignUp from "./SignUp"; // Registration Page
import ContactPage from "./components/ContactPage"; // Contact Us Page
import FeaturesPage from "./components/FeaturePage"; // Features Page
import NavBar from "./components/NavBar"; 
function App() {
  return (
    <Router>
      <div>
        {/* Navbar shared across all pages */}
        <NavBar />

        {/* Main Routes */}
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Features Page Route */}
          <Route path="/features" element={<FeaturesPage />} />

          {/* Contact Us Page Route */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Cost Estimation Tool Page Route */}
          <Route path="/estimation" element={<EstimationForm />} />

          {/* Cost Breakdown Result Page Route */}
          <Route path="/cost-breakdown" element={<CostBreakdownChart />} />

          {/* Login Page Route */}
          <Route path="/login" element={<SignIn />} />

          {/* Registration Page Route */}
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
