import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import './LoginForm.scss';

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errorResponse, setErrorResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Validar el correo electrónico en tiempo real
    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrorResponse("Por favor, introduce un correo electrónico válido.");
      } else {
        setErrorResponse("");
      }
    }
  };

  const validateEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bansobackend-production.up.railway.app/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const json = await response.json();
        localStorage.setItem('verifyCode', json.verifyCodeI);
        setUser({
          email: "",
          password: "",
        });
        console.log("Felicidades Iniciaste Sesión");
        // Redirigir a la página de dashboard
        window.location.href = '/dashboard';
      } else {
        console.log("No se puede iniciar sesión");
        const json = await response.json();
        setErrorResponse(json.body.error);
        // Mostrar la alerta/modal
        setOpenModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="container">
      <form className="login-form">
        <h1 className="form-title">Iniciar Sesión</h1>
        {!!errorResponse && <div className="error-message">{errorResponse}</div>}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input ${errorResponse ? 'error' : ''}`}
            name="email"
            type="email"
            onChange={handleChange}
            value={user.email}
            required
          />
          {errorResponse && <div className="error-alert">{errorResponse}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="password-input">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={user.password}
              required
            />
            <i className={`password-toggle-icon ${showPassword ? "fa fa-eye-slash" : "fa fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <button className="form-button" onClick={handleLogin} type="submit">Iniciar Sesión</button>
      </form>
      
      {/* Modal de la alerta */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="alert-modal" style={{ padding: '20px', background: '#fff', borderRadius: '10px', width: '300px', margin: 'auto', marginTop: '100px' }}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            Error al iniciar sesión
          </Typography>
          <Typography variant="body1" id="modal-description">
            {errorResponse}
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
