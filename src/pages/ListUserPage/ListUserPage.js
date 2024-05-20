import React, { useEffect, useState } from 'react';
import './ListUserPage.scss';

const ListUserPage = () => {
  // Definir el estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Define la cantidad de Usuarios por página
  
  // Simular una llamada a una API para obtener los usuarios
  useEffect(() => {
    fetch('https://bansobackend-production.up.railway.app/api/v1/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  // Calcular índices de usuarios para la paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='users-view'>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers && currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay usuarios en la base de datos</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Paginación */}
      {users.length > usersPerPage && (
        <div className="pagination">
          <ul>
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
              <li key={index}>
                <button onClick={() => paginate(index + 1)}>{index + 1}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ListUserPage;
