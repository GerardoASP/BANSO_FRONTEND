import React, { useEffect, useState } from "react";
import "./UpdateProjectForm.scss";
import { useLocation } from "react-router-dom";
import { Modal, Typography, Button, Box } from "@mui/material";

const projectStates = ["En formulación", "En proceso", "Finalizado", "En revisión"];

const UpdateProjectForm = () => {
  const [userData, setUserData] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchDataUserByType = async () => {
      try {
        const verifyCode = localStorage.getItem('verifyCode');
        const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-verify-code/${verifyCode}`);
        const jsonData = await response.json();
        setUserData(jsonData);

        // Aquí establecemos el autor en el estado de publicación
        setProjectData(prevState => ({
          ...prevState,
          projectUser: jsonData._id // Asegúrate de que jsonData tenga el formato esperado
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
  const [project,setProject] = useState('');

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
    fetch(`https://bansobackend-production.up.railway.app/api/v1/projects/${myQueryParam}`)
      .then(response => response.json())
      .then(data => setProject(data))
  },[])

  const [projectData, setProjectData] = useState({
    nameProject: "",
    stateProject: "",
    dateStart: "",
    descriptionProject: "",
    projectUser:"",
    linkGeneralRepository: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    // Validación del formulario
    if (!projectData.nameProject || !projectData.stateProject || !projectData.dateStart || !projectData.descriptionProject) {
      setErrorMessage("Por favor complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/projects/update-project/${myQueryParam}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        const json = await response.json();
        setProjectData({
          nameProject: "",
          stateProject: "",
          dateStart: "",
          descriptionProject: "",
          projectUser:`${userData._id}`,
          linkGeneralRepository: "",
        });
        console.log("Felicidades, has actualizado un proyecto.");
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
    <div className="project-form-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h2>Actualización de Proyecto</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="form-group">
          <label>Nombre del Proyecto</label>
          <input
            type="text"
            name="nameProject"
            value={projectData.nameProject}
            onChange={handleChange}
            placeholder={project.nameProject}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Estado del Proyecto</label>
          <select name="stateProject" value={projectData.stateProject} onChange={handleChange} className="form-control">
            <option value="" >{project.stateProject}</option>
            {projectStates.map((stateProject, index) => (
              <option key={index} value={stateProject}>
                {stateProject}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Fecha de Inicio</label>
          <input type="date" name="dateStart" value={projectData.dateStart} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Descripción del Proyecto</label>
          <textarea
            name="descriptionProject"
            value={projectData.descriptionProject}
            onChange={handleChange}
            placeholder={project.descriptionProject}
            className="form-control"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Link Repositorio 1(General)</label>
          <input
            type="text"
            name="linkGeneralRepository"
            value={projectData.linkGeneralRepository}
            onChange={handleChange}
            placeholder={project.linkGeneralRepository}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Proyecto</button>
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
          Has actualizado tu proyecto exitosamente.
        </Typography>
        <Button onClick={handleCloseSuccessModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  </div>
);
};

export default UpdateProjectForm;
