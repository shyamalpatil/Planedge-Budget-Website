import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  CssBaseline,
  MenuItem,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Theme setup
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const EstimationForm = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    slabArea: "",
    saleableArea: "",
    projectType: "",
    buildingType: "",
    structureType: "",
    floors: "",
    flatsPerCore: "",
    liftsPerCore: "",
    fsi: "",
    basements: "",
    podiums: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = [
      "projectName",
      "location",
      "slabArea",
      "saleableArea",
      "projectType",
      "buildingType",
      "structureType",
      "floors",
      "fsi",
      "basements",
      "podiums",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field} field.`);
        return;
      }

      if (
        ["slabArea", "saleableArea", "floors", "fsi", "basements", "podiums"].includes(field) &&
        isNaN(Number(formData[field]))
      ) {
        setError(`Invalid numeric value for ${field}.`);
        return;
      }
    }

    generatePDF();
  };
  const navigate = useNavigate();
  const generatePDF = () => {
    const doc = new jsPDF();
  
    const slabArea = parseFloat(formData.slabArea) || 1;
    const saleableArea = parseFloat(formData.saleableArea) || 1;
    const floors = parseInt(formData.floors) || 1;
    const basements = parseInt(formData.basements) || 0;
    const podiums = parseInt(formData.podiums) || 0;
    const liftsPerCore = parseInt(formData.liftsPerCore) || 1;
    const projectType = formData.projectType || 'Medium';
    const projectLocation = formData.location || 'Pune';
  
    // Location multipliers
    const locationMultipliers = {
      Pune: 1.0,
      Mumbai: 1.2,
      Delhi: 1.15,
      Rural: 0.85,
    };
    const locationMultiplier = locationMultipliers[projectLocation] || 1.0;
  
    // Scale factor based on slab area
    const scaleFactor = slabArea < 50000 ? 1.1 : slabArea > 200000 ? 0.95 : 1.0;
  
    // Inflation adjustments
    const inflationRate = 0.05;
    const yearsSinceLastUpdate = 2;
  
    // Constants by project type
    const constants = {
      Basic: {
        earthWork: 22,
        rccWork: 850,
        masonry: 145,
        waterproofing: 18,
        doors: 40,
        windows: 25,
        flooring: 50,
        grills: 10,
        painting: 32,
        plumbing: 50,
        electrical: 40,
        lift: 400000,
        firefighting: 25000,
        facade: 30,
        amenities: 60,
        misc: 10,
        civilInfra: 40,
        serviceInfra: 20,
        plumbingServices: 50,
        electricalServices: 60,
        technicalConsultants: 800000,
        siteOverhead: 400000,
      },
      Medium: {
        earthWork: 27,
        rccWork: 950,
        masonry: 165,
        waterproofing: 22,
        doors: 50,
        windows: 30,
        flooring: 70,
        grills: 15,
        painting: 40,
        plumbing: 60,
        electrical: 50,
        lift: 500000,
        firefighting: 30000,
        facade: 40,
        amenities: 80,
        misc: 15,
        civilInfra: 50,
        serviceInfra: 25,
        plumbingServices: 60,
        electricalServices: 70,
        technicalConsultants: 1000000,
        siteOverhead: 500000,
      },
      Premium: {
        earthWork: 33,
        rccWork: 1100,
        masonry: 185,
        waterproofing: 26,
        doors: 60,
        windows: 35,
        flooring: 90,
        grills: 20,
        painting: 50,
        plumbing: 70,
        electrical: 60,
        lift: 600000,
        firefighting: 35000,
        facade: 50,
        amenities: 100,
        misc: 20,
        civilInfra: 60,
        serviceInfra: 30,
        plumbingServices: 70,
        electricalServices: 80,
        technicalConsultants: 1200000,
        siteOverhead: 600000,
      },
    };
  
    const projectConstants = constants[projectType];
  
    // Apply adjustments for location, scale, and inflation
    Object.keys(projectConstants).forEach((key) => {
      projectConstants[key] *=
        scaleFactor * locationMultiplier * Math.pow(1 + inflationRate, yearsSinceLastUpdate);
    });
  
    // Budget breakdown
    const breakdown = [
      { head: 'Earth Work', amount: slabArea * projectConstants.earthWork },
      { head: 'RCC Work', amount: slabArea * projectConstants.rccWork },
      { head: 'Masonry, Plaster Work', amount: slabArea * projectConstants.masonry },
      { head: 'Waterproofing Work', amount: slabArea * projectConstants.waterproofing },
      { head: 'Doors & Wooden Works', amount: saleableArea * projectConstants.doors },
      { head: 'Windows & Sliding Doors', amount: saleableArea * projectConstants.windows },
      { head: 'Flooring and Tiling Works', amount: slabArea * projectConstants.flooring * floors },
      { head: 'MS & SS Works - Grills & Railings', amount: slabArea * projectConstants.grills },
      { head: 'Painting & Polishing Works', amount: slabArea * projectConstants.painting },
      { head: 'Plumbing, Drainage Work', amount: slabArea * projectConstants.plumbing },
      { head: 'Electrical Work', amount: slabArea * projectConstants.electrical },
      { head: 'Lift Work', amount: liftsPerCore * projectConstants.lift },
      { head: 'Buildings Fire Fighting Work', amount: slabArea * projectConstants.firefighting },
      { head: 'Elevation, Glazing, Facade Work', amount: slabArea * projectConstants.facade },
      { head: 'Bldg Amenities', amount: saleableArea * projectConstants.amenities },
      { head: 'Misc, Dep. Labour, Cleaning', amount: slabArea * projectConstants.misc },
      { head: 'Civil Infrastructure', amount: saleableArea * projectConstants.civilInfra },
      { head: 'Services Civil Infrastructure', amount: saleableArea * projectConstants.serviceInfra },
      { head: 'Plumbing Services', amount: saleableArea * projectConstants.plumbingServices },
      { head: 'Electrical Services', amount: saleableArea * projectConstants.electricalServices },
      { head: 'Technical Consultants', amount: projectConstants.technicalConsultants },
      { head: 'Site Overhead Expenses', amount: projectConstants.siteOverhead },
    ];
  
    const total_budget = breakdown.reduce((sum, item) => sum + item.amount, 0);
  
    // Generate PDF
    const projectName = formData.projectName || 'Unnamed Project';
    doc.setFontSize(16);
    doc.text(`COST ESTIMATE OF PROJECT: ${projectName.toUpperCase()}`, 105, 15, { align: 'center' });
  
    const formattedDate = `R0.${new Date().getDate()}.${
      new Date().getMonth() + 1
    }.${new Date().getFullYear()}`;
    doc.setFontSize(12);
    doc.text(`L1-ESTIMATE- ${formattedDate}`, 105, 22, { align: 'center' });
  
    // Budget Overview
    const budgetOverview = [
      ['Project Budget on Saleable Area', '', '', 'Per/Sqft', (total_budget / saleableArea).toFixed(2)],
      ['Project Budget on Slab Area', '', '', 'Per/Sqft', (total_budget / slabArea).toFixed(2)],
      ['TOTAL BUDGET OF PROJECT CONST.', '', '', '', total_budget.toLocaleString('en-IN')],
    ];
  
    doc.autoTable({
      startY: 30,
      body: budgetOverview,
      styles: { lineColor: [0, 0, 0], lineWidth: 0.1 },
      theme: 'grid',
    });
  
    // Detailed Breakdown
    const sections = [
      { title: 'A. CONSTRUCTION BUDGET: ALL BUILDINGS', data: breakdown.slice(0, 16) },
      { title: 'B. PROJECT INFRASTRUCTURE & AMENITIES', data: breakdown.slice(16, 21) },
      { title: 'C. TECHNICAL OVERHEADS', data: breakdown.slice(21, 23) },
    ];
  
    sections.forEach((section) => {
      doc.text(section.title, 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Sr.', 'Budget Head', 'Amount', 'Rate/Slab Area', 'Rate/Saleable Area']],
        body: section.data.map((item, index) => [
          index + 1,
          item.head,
          item.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace(/\s/g, ''),
          `${(item.amount / slabArea).toFixed(2)} INR/sqft`,
          `${(item.amount / saleableArea).toFixed(2)} INR/sqft`,
        ]),
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1 },
        theme: 'grid',
      });
    });
  
    doc.save(`${projectName}_Cost_Estimate.pdf`);
    // Redirect to chart page
  navigate('/cost-breakdown', { state: { breakdown } });
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography variant="h4" gutterBottom>
          Project Cost Estimation
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Slab Area (sqft)"
                name="slabArea"
                type="number"
                value={formData.slabArea}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Saleable Area (sqft)"
                name="saleableArea"
                type="number"
                value={formData.saleableArea}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Project Type"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
              >
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Building Type"
                name="buildingType"
                value={formData.buildingType}
                onChange={handleChange}
                required
              >
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Residential">Residential</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Structure Type"
                name="structureType"
                value={formData.structureType}
                onChange={handleChange}
                required
              >
                <MenuItem value="Conventional">Conventional</MenuItem>
                <MenuItem value="PT">PT</MenuItem>
                <MenuItem value="Aluform">Aluform</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Number of Floors"
                name="floors"
                type="number"
                value={formData.floors}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="FSI"
                name="fsi"
                type="number"
                value={formData.fsi}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Number of Basements"
                name="basements"
                type="number"
                value={formData.basements}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Number of Podiums"
                name="podiums"
                type="number"
                value={formData.podiums}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Flats per Core"
                name="flatsPerCore"
                type="number"
                value={formData.flatsPerCore}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Lifts per Core"
                name="liftsPerCore"
                type="number"
                value={formData.liftsPerCore}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Generate Budget
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default EstimationForm;

