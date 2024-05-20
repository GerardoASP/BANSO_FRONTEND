import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './UpdatePublication.scss';
const UpdatePublication = () => {
  const [userData, setUserData] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const fetchDataUserByType = async () => {
      try {
        const verifyCode = localStorage.getItem('verifyCode');
        const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-verify-code/${verifyCode}`);
        const jsonData = await response.json();
        setUserData(jsonData);

        // Aquí establecemos el autor en el estado de publicación
        setPublicationData(prevState => ({
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

  const location = useLocation();
  const [myQueryParam,setMyQueryParam] = useState('');
  const [publication,setPublication] = useState('');

  useEffect(() => {
    // Parse the query parameters from the search string
    const params = new URLSearchParams(location.search);
    
    // Get the value of the query parameter you're interested in
    const myQueryParam = params.get('id');
    setMyQueryParam(myQueryParam);
    // Do something with the query parameter value
    console.log('My query parameter value:', myQueryParam);
  }, [location]);

  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    // Get the value of the query parameter you're interested in
    const myQueryParam = params.get('id');
    setMyQueryParam(myQueryParam);
    fetch(`https://bansobackend-production.up.railway.app/api/v1/publications/${myQueryParam}`)
      .then(response => response.json())
      .then(data => setPublication(data))
  },[])

  const [publicationData, setPublicationData] = useState({
    title: "",
    description: "",
    author: "",
    observations: "",
    contact: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublicationData({ ...publicationData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setEnviado(true);
    // Validación del formulario
    if (!publicationData.title || !publicationData.description || !publicationData.contact) {
      setErrorMessage("Por favor complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/publications/update-publication/${myQueryParam}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publicationData),
      });
      
      if (response.ok) {
        const json = await response.json();
        setPublicationData({
          title: "",
          description: "",
          author:`${userData._id}`,
          observations: "",
          contact: "",
        });
        console.log("Felicidades, has actualizado una publicacion.");
        setSuccessModalOpen(true);
      } else {
        const json = await response.json();
        setErrorMessage(json.body.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="contenedor">
      <form onSubmit={handleSubmit} className="formulario">
        <h1 className="titulo">Actualización de Publicación</h1>
        {!!errorMessage && <div className="mensaje-error">{errorMessage}</div>}
        <div className="grupo-formulario">
          <label className="etiqueta">Nombre de la publicación *</label>
          <input
            className={`entrada-formulario ${enviado && !publication.title && 'error'}`}
            type="text"
            name="title"
            onChange={handleChange}
            value={publicationData.title}
            placeholder={publication.title}
            required
          />
        </div>
        <div className="grupo-formulario">
          <label className="etiqueta">Descripción *</label>
          <textarea
            className={`entrada-formulario ${enviado && !publication.description && 'error'}`}
            name="description"
            onChange={handleChange}
            value={publicationData.description}
            placeholder={publication.description}
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
            value={publicationData.contact}
            placeholder={publication.contact}
            required
          />
        </div>
        <button className="boton-formulario">Actualizar Publicación</button>
      </form>
      <Modal
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >

        <Box className="success-modal" style={{ padding: '20px', background: '#fff', borderRadius: '10px', width: '300px', margin: 'auto', marginTop: '100px' }}>
        <Typography variant="h5" id="modal-title" gutterBottom>
          ¡Felicidades!
        </Typography>
        <Typography variant="body1" id="modal-description">
          Has actualizado tu publicación exitosamente.
        </Typography>
        <Button onClick={handleCloseSuccessModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Cerrar
        </Button>
      </Box>
    </Modal>
    </div>
  )
}

export default UpdatePublication
