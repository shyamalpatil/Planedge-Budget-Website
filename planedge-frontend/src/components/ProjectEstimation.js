import React, { useState } from 'react';
const ProjectEstimation = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    location: '',
    slabArea: 0,
    saleableArea: 0,
    buildingType: '',
    structureType: '',
    floors: 0,
    flatsPerCore: 0,
    liftsPerCore: 0,
    fsi: 0,
    basements: 0
  });
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate input
    if (!formData.projectType || formData.slabArea <= 0 || formData.saleableArea <= 0) {
      setError('Please fill in all required fields and ensure the slab and saleable areas are valid.');
      return;
    }
    setError(null); // Clear previous error
    // Calculation logic based on constants from the table
    const baseRates = {
      medium: { slabRate: 32.73, saleableRate: 45.53 },
      standard: { slabRate: 41.72, saleableRate: 58.03 },
      premium: { slabRate: 82.54, saleableRate: 114.82 },
      luxurious: { slabRate: 155.87, saleableRate: 216.81 }
    };
    const { projectType, slabArea, saleableArea } = formData;
    const rates = baseRates[projectType.toLowerCase()];
    const estimatedBudget =
      slabArea * rates.slabRate + saleableArea * rates.saleableRate;
    setBudget(estimatedBudget);
  };
  return (
    <div>
      <h1>Project Cost Estimation</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type/Class of Project:</label>
          <select name="projectType" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Medium">Medium</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Luxurious">Luxurious</option>
          </select>
        </div>
        <div>
          <label>Project Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Slab Area (sqft):</label>
          <input
            type="number"
            name="slabArea"
            value={formData.slabArea}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Saleable Area (sqft):</label>
          <input
            type="number"
            name="saleableArea"
            value={formData.saleableArea}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Type of Building:</label>
          <select name="buildingType" onChange={handleChange}>
            <option value="">Select</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
          </select>
        </div>
        <div>
          <label>Type of Structure:</label>
          <select name="structureType" onChange={handleChange}>
            <option value="">Select</option>
            <option value="PT">PT</option>
            <option value="Alu form">Alu form</option>
            <option value="Conv">Conventional</option>
          </select>
        </div>
        <div>
          <label>Number of Floors:</label>
          <input
            type="number"
            name="floors"
            value={formData.floors}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Flats per Core:</label>
          <input
            type="number"
            name="flatsPerCore"
            value={formData.flatsPerCore}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Lifts per Core:</label>
          <input
            type="number"
            name="liftsPerCore"
            value={formData.liftsPerCore}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Available FSI:</label>
          <input
            type="number"
            name="fsi"
            value={formData.fsi}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Basements/Podiums:</label>
          <input
            type="number"
            name="basements"
            value={formData.basements}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Estimate Budget</button>
      </form>
      {budget && <h2>Total Estimated Budget: {budget.toFixed(2)} INR</h2>}
    </div>
  );
};
export default ProjectEstimation;