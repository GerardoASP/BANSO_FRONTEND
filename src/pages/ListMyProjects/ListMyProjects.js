import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import GitHubIcon from '@mui/icons-material/GitHub';
import './ListMyProjects.scss';

const ListMyProjects = () => {
  const [userData, setUserData] = useState({});
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchDataUserByType = async () => {
      try {
        const verifyCode = localStorage.getItem('verifyCode');
        const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-verify-code/${verifyCode}`);
        const jsonData = await response.json();
        setUserData(jsonData);

      } catch (error) {
        console.error('Error fetching data2:', error);
      }
    };
    fetchDataUserByType();
    const intervalId = setInterval(fetchDataUserByType, 1000);
    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    const verifyCode = localStorage.getItem('verifyCode');
    fetch(`https://bansobackend-production.up.railway.app/api/v1/users/${verifyCode}/projects`)
      .then(response => response.json())
      .then(data => setProjects(data));
  }, [userData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(project => {
    return project.nameProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           project.descriptionProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           project.stateProject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUpdate = (_id) => {
    window.location.href = `/update-project?id=${_id}`;
  }

  const handleDelete = async (_id) => {
    const verifyCode = localStorage.getItem('verifyCode');
    try {
      const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/projects/${_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({"userVerifyCode":verifyCode})
      });
      if (response.status === 204) {
        setProjects(projects.filter(project => project._id !== _id));
      } else {
        console.log("Deletion failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleButtonClick = (github_url) => {
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\.git)?$/;

    if (github_url && githubRegex.test(github_url)) {
        window.open(github_url, '_blank');
    } else {
        setOpenModal(true);
    }
};

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='projects-view'>
      <Typography variant="h2" style={{ marginBottom: '20px' }}>Lista de Mis Proyectos</Typography>
      <Box className="search-container" style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar" 
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginRight: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }}
        />
        <Button variant="contained" color="primary" style={{ padding: '8px' }}>
          <SearchIcon />
        </Button>
      </Box>
      <table>
        <thead>
          <tr>
            <th>Nombre Proyecto</th>
            <th>Descripción Proyecto</th>
            <th>Estado Proyecto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects && currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.nameProject}</td>
                <td>{project.descriptionProject}</td>
                <td>{project.stateProject}</td>
                <td>
                  <IconButton onClick={() => handleUpdate(project._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <GitHubIcon onClick={()=>handleButtonClick(project.linkGeneralRepository)} />
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay proyectos en la base de datos</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {filteredProjects.length > projectsPerPage && (
          <ul>
            {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }).map((_, index) => (
              <li key={index}>
                <button onClick={() => paginate(index + 1)} style={{ padding: '8px', margin: '5px', borderRadius: '5px', border: '1px solid #ccc', background: currentPage === index + 1 ? '#63C2DE' : 'transparent', color: currentPage === index + 1 ? '#fff' : '#333' }}>{index + 1}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="alert-modal" style={{ padding: '20px', background: '#fff', borderRadius: '10px', width: '300px', margin: 'auto', marginTop: '100px' }}>
          <Typography variant="h5" id="modal-title" gutterBottom>
            Repositorio no disponible
          </Typography>
          <Typography variant="body1" id="modal-description">
            No se encontró un repositorio registrado para este proyecto.
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ListMyProjects;