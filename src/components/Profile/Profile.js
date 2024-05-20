// Profile.js
import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaCamera, FaWhatsapp } from 'react-icons/fa';
import { MdEmail, MdPhone, MdKeyboardBackspace } from 'react-icons/md';
import './Profile.scss';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    user_career: '', // Added user_career field
    role: 'Diseñadora Web',
    email: '',
    phone: '123 456 789',
    profileImage: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp',
    projects: [
      { id: 1, name: 'Proyecto 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', image: 'https://via.placeholder.com/150' },
      { id: 2, name: 'Proyecto 2', description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', image: 'https://via.placeholder.com/150' },
      { id: 3, name: 'Proyecto 3', description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', image: 'https://via.placeholder.com/150' }
    ],
    userId:'',
  });
  const [publications,setPublications] = useState([]);
  useEffect(()=>{
    const fetchDataUserByType = async () => {
      try {
	      const verifyCode = localStorage.getItem('verifyCode');
        const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-verify-code/${verifyCode}`);
        const jsonData = await response.json();
        setUserData(prevData => ({
          ...prevData,
          name: jsonData.firstname,
          user_career: jsonData.user_career,
          userId: jsonData._id,
          email:jsonData.email 
        }));
        // Aquí establecemos el autor en el estado de publicación
        setUserData(prevState => ({
          ...prevState,
          userId: jsonData._id // Asegúrate de que jsonData tenga el formato esperado
        }));
        //console.log(userData)
      } catch (error) {
        console.error('Error fetching data2:', error);
      }
    };
    fetchDataUserByType();
    // Establecer un temporizador para actualizar automáticamente cada 1 segundo
    const intervalId = setInterval(() => {
      fetchDataUserByType();
      //console.log(userData)
    }, 1000); // 1 segundos

    // Limpiar el temporizador al desmontar el componente
    return () => clearInterval(intervalId);
},[]);

useEffect(()=>{
  try{
    const verifyCode = localStorage.getItem('verifyCode');
    fetch(`https://bansobackend-production.up.railway.app/api/v1/users/${verifyCode}/publications`)
    .then(response => response.json())
    .then(data => setPublications(data));
  }catch(error){
    console.log(error)
  }
  
},[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Información actualizada:', userData);
    setEditing(false);
  };


  const handleImageChange = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setUserData({ ...userData, profileImage: reader.result });
      }
    };

    reader.readAsDataURL(image);
  };

  const handleWhatsappClick = () => {
    console.log('Abrir WhatsApp');
  };

  const handleUpdate = (_id) => {
    window.location.href = `/update-publication?id=${_id}`;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-image">
            <img src={userData.profileImage} alt="Perfil" />
            {editing && (
              <label htmlFor="imageUpload" className="edit-icon">
                <FaCamera />
                <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
          {editing ? (
            <>
              <input type="text" name="name" value={userData.name} onChange={handleChange} />
              <input type="text" name="user_career" value={userData.user_career} onChange={handleChange} /> {/* Added user_career field */}
              <input type="text" name="role" value={userData.role} onChange={handleChange} />
            </>
          ) : (
            <>
              <h2>{userData.name}</h2>
              <p>{userData.user_career}</p> {/* Display user_career */}
              <p>{userData.role}</p>
            </>
          )}
          <div className="edit-icon" onClick={handleEdit}>
            {editing ? <FaSave /> : <FaEdit />}
          </div>
        </div>
        <div className="back-icon" onClick={() => window.history.back()}>
          <MdKeyboardBackspace />
        </div>
      </div>
      <hr />
      <div className="profile-details">
        <h3>Información de Contacto</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <MdEmail className="icon" />
            <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!editing} />
          </div>
          <div className="input-group">
            <MdPhone className="icon" />
            <input type="tel" name="phone" value={userData.phone} onChange={handleChange} disabled={!editing} />
          </div>
          {editing && (
            <button type="submit">Guardar</button>
          )}
        </form>
      </div>
      <hr />
      <div className="profile-projects">
        <h3>Publicaciones</h3>
        <div className="projects-container">
          {Array.isArray(publications) && publications.map(project => (
            <div className="project-card" key={project._id}>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <IconButton onClick={() => handleUpdate(project._id)}>
                <EditIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div className="whatsapp-icon" onClick={handleWhatsappClick}>
        <FaWhatsapp />
      </div>
    </div>
  );
}

export default Profile;
