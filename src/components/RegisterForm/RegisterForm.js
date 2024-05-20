import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "./RegisterForm.scss";

const departments = [
  "Ingeniería de Sistemas",
  "Ingeniería Mecánica",
  "Ingeniería Biomédica",
  "Ingeniería Industrial",
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #ff0000', // Rojo brillante
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
};

const RegisterForm = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    department: "",
    document: "",
    email: "",
    password: "",
    user_career: ""
  });
  const [errorResponse, setErrorResponse] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "document") {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setUser({ ...user, [name]: value });
        setDocumentError("");
        setOpen(false);
      } else {
        setDocumentError("El documento debe contener solo números y no más de 10 dígitos.");
        setOpen(true);
      }
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentError) {
      try {
        const response = await fetch("https://bansobackend-production.up.railway.app/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const json = await response.json();
          setUser({
            firstname: "",
            lastname: "",
            department: "",
            municipality: "",
            document_type: "",
            document: "",
            email: "",
            password: "",
            user_career: ""
          });
          <Navigate to="/" />;
        } else {
          const json = await response.json();
          setErrorResponse(json.body.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="form-title">Registro</h1>
        {!!errorResponse && <div className="error-message">{errorResponse}</div>}
        <input
          className="form-input"
          type="text"
          name="firstname"
          placeholder="Nombres"
          onChange={handleChange}
          value={user.firstname}
          required
        />
        <input
          className="form-input"
          type="text"
          name="lastname"
          placeholder="Apellidos"
          onChange={handleChange}
          value={user.lastname}
          required
        />
        <div className="select-container">
          <select
            className="form-input"
            name="user_career"
            onChange={handleChange}
            value={user.user_career}
            required
          >
            <option value="">Selecciona una carrera</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
        <input
          className={`form-input ${documentError ? 'error-border' : ''}`}
          type="text"
          name="document"
          placeholder="Documento"
          onChange={handleChange}
          value={user.document}
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          value={user.email}
          required
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          value={user.password}
          required
        />
        <button className="form-button">Crear cuenta</button>
        <p className="form-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Error de Documento
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {documentError}
          </Typography>
          <button className="close-button" onClick={() => setOpen(false)}>Cerrar</button>
        </Box>
      </Modal>
    </div>
  );
};

export default RegisterForm;
