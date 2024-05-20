import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import './UpdateUserForm.scss';


const countries = ["Colombia", "Argentina", "Perú", "México", "Chile"];
const departments = ["Caldas", "Antioquia", "Valle del Cauca", "Bogotá DC", "Santander"];
const municipalities = ["Manizales", "Medellín", "Cali", "Bogotá", "Bucaramanga"];

const UpdateUserForm = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    country: "",
    department: "",
    municipality: "",
    document_type: "",
    document: "",
    email: "",
    password: "",
  });
  const [errorResponse, setErrorResponse] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bansobackend-production.up.railway.app/api/v1/users/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const json = await response.json();
        setUser({
          firstname: "",
          lastname: "",
          country: "",
          department: "",
          municipality: "",
          document_type: "",
          document: "",
          email: "",
          password: "",
        });
        <Navigate to="/" />;
      } else {
        const json = await response.json();
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="form-title">Actualizar Info</h1>
        {!!errorResponse && <div className="error-message" style={{ color: 'red' }}>{errorResponse}</div>}
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            className="form-input"
            type="text"
            name="firstname"
            onChange={handleChange}
            value={user.firstname}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            type="text"
            name="lastname"
            onChange={handleChange}
            value={user.lastname}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Country</label>
          <select
            className="form-input"
            name="country"
            onChange={handleChange}
            value={user.country}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="form-input"
            name="department"
            onChange={handleChange}
            value={user.department}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Municipality</label>
          <select
            className="form-input"
            name="municipality"
            onChange={handleChange}
            value={user.municipality}
            required
          >
            <option value="">Select Municipality</option>
            {municipalities.map((municipality, index) => (
              <option key={index} value={municipality}>{municipality}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Document Type</label>
          <input
            className="form-input"
            type="text"
            name="document_type"
            onChange={handleChange}
            value={user.document_type}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Document</label>
          <input
            className="form-input"
            type="text"
            name="document"
            onChange={handleChange}
            value={user.document}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            onChange={handleChange}
            value={user.email}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            onChange={handleChange}
            value={user.password}
            required
          />
        </div>
        <button className="form-button">Create account</button>
      </form>
    </div>
  );
}

export default  UpdateUserForm;
