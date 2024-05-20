import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import './RegisterPublication.scss';

const RegisterPublication = () => {
  const [userData, setUserData] = useState({});

  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublication({ ...publication, [name]: value });
  };

  useEffect(() => {
    const fetchDataUserByType = async () => {
      try {
        const verifyCode = localStorage.getItem('verifyCode');
        const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-verify-code/${verifyCode}`);
        const jsonData = await response.json();
        setUserData(jsonData);
        
        // Aquí establecemos el autor en el estado de publicación
        setPublication(prevState => ({
          ...prevState,
          author: jsonData._id // Asegúrate de que jsonData tenga el formato esperado
        }));
      } catch (error) {
        console.error('Error fetching data2:', error);
      }
    };
    fetchDataUserByType();
    const intervalId = setInterval(fetchDataUserByType, 1000);
    return () => clearInterval(intervalId);
  }, []);

const [publication, setPublication] = useState({
    title: "",
    description: "",
    author: "",
    observations: "",
    contact: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviado(true);

    // Validación del formulario
    if (!publication.title || !publication.description || !publication.contact) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
        console.log(publication)
      const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/publications/new-publication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publication),
      });
      if (response.ok) {
        setPublication({
          title: "",
          description: "",
          dateStart: "",
          author: `${userData._id}`,
          observations: "",
          contact: "",
        });
        alert("¡Felicidades! Has creado una nuevo publicación.");
      } else {
        const json = await response.json();
        setError(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="contenedor">
      <form onSubmit={handleSubmit} className="formulario">
        <h1 className="titulo">Crear Publicación</h1>
        {!!error && <div className="mensaje-error">{error}</div>}
        <div className="grupo-formulario">
          <label className="etiqueta">Nombre de la publicación *</label>
          <input
            className={`entrada-formulario ${enviado && !publication.title && 'error'}`}
            type="text"
            name="title"
            onChange={handleChange}
            value={publication.title}
            required
          />
        </div>
        <div className="grupo-formulario">
          <label className="etiqueta">Descripción *</label>
          <textarea
            className={`entrada-formulario ${enviado && !publication.description && 'error'}`}
            name="description"
            onChange={handleChange}
            value={publication.description}
            required
          ></textarea>
        </div>
        <div className="grupo-formulario">
          <label className="etiqueta">Contacto </label>
          <input
            className={`entrada-formulario ${enviado && !publication.contact && 'error'}`}
            type="text"
            name="contact"
            onChange={handleChange}
            value={publication.contact}
            required
          />
        </div>
        <button className="boton-formulario">Crear Publicación</button>
      </form>
    </div>
  );
}
export default RegisterPublication;