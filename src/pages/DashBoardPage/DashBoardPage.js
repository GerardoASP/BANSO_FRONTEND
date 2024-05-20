import React, { useEffect, useState } from 'react';
import Logo from '../../assets/images/LOGO_BANSO_v2_amarillo-removebg-preview.png';
import { Link } from 'react-router-dom';
import { FiUser, FiHome, FiHelpCircle, FiSearch, FiPlus, FiLogOut, FiChevronLeft, FiChevronRight, FiInstagram, FiFacebook, FiX } from 'react-icons/fi';
import CampaignIcon from '@mui/icons-material/Campaign';
import "./DashBoardPage.scss";


const DashboardPage = () => {
  const [publications, setPublications] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    fetch(`https://bansobackend-production.up.railway.app/api/v1/publications`)
      .then(response => response.json())
      .then(data => setPublications(data))
      .catch(error => console.error('Error fetching publications:', error));
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("verifyCode");
      window.location.href = "/"; 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleClose = () => {
    const universityInfo = document.querySelector('.university-info');
    if (universityInfo) {
      universityInfo.style.display = 'none'; 
    }
  };  

  const handlePrevClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const handleNextClick = () => {
    if (startIndex + itemsPerPage < publications.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  return (
    <div className='dashboard-container'>
      <div className='sidebar'>
        <div className='logo-container'>
          <img src={Logo} alt="Logo" className='logo'/>
          <h1>BANSO</h1>
        </div>
        <div className='nav-links'>
          <Link to="/dashboard" className='nav-link'><FiHome className='nav-icon'/>Inicio</Link>
          <Link to="/profile" className='nav-link'><FiUser className='nav-icon'/>Perfil</Link>
          <Link to="/register-project" className='nav-link'><FiPlus className='nav-icon'/>Crear Proyecto</Link>
          <Link to="/projects" className='nav-link'><FiSearch className='nav-icon'/>Ver Proyectos</Link>
          <Link to="/myprojects" className='nav-link'><FiSearch className='nav-icon'/>Ver Proyectos Propios</Link>
          <Link to="/register-publication" className='nav-link'><FiPlus className='nav-icon'/>Crear Publicacion</Link>
          <Link to="/users" className='nav-link'><FiUser className='nav-icon'/>Lista de Usuarios</Link>
        </div>
        <button className='logout-button' onClick={logout}><FiLogOut className='nav-icon'/>Cerrar Sesión</button>
        <div className="university-info">
          
        </div>
      </div>
      <div className='main-content'>
        <h1>Bienvenido a tu Banco de Proyectos</h1>
        <p>Explora las opciones disponibles en el menú lateral para acceder a diferentes secciones y funcionalidades.</p>
        <div className='floating-buttons'>
          <Link to="/register-publication" className='create-publication-button'>
            <CampaignIcon className='create-icon' />
          </Link>
          <Link to="/register-project" className='create-project-button'>
            <FiPlus className='create-icon' />
          </Link>
        </div>
        <div className='projects-container'>
          <h2>Publicaciones Recientes</h2>
          <div className='projects-wrapper'>
            <button className='prev-button' onClick={handlePrevClick}><FiChevronLeft className='arrow-icon'/></button>
            <div className='project-carousel'>
              {Array.isArray(publications) && publications.slice(startIndex, startIndex + itemsPerPage).map(project => (
                <div className='project-card' key={project.id}>
                  <img src={`https://www.autonoma.edu.co/sites/default/files/Universidad_Autonoma_de_Manizales.png`} alt={project.nameProject} />
                  <div className='project-details'>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <p>{"Para más información enviar mensaje a : " + project.contact}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className='next-button' onClick={handleNextClick}><FiChevronRight className='arrow-icon'/></button>
          </div>
        </div>
        <div className='social-section'>
          <a href="https://www.instagram.com/"><FiInstagram className='social-icon' /></a>
          <a href="https://www.facebook.com/"><FiFacebook className='social-icon' /></a>
          <button className='close-button' onClick={handleClose}><FiX /></button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
