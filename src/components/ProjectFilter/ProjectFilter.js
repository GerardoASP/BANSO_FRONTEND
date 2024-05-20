import React, { useEffect } from 'react';
import './ProjectFilter.scss';

const ProjectFilter = () => {
  useEffect(() => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');

    const handleSearch = async () => {
      const searchTerm = searchInput.value.trim();

      if (searchTerm !== '') {
        try {
          const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/projects/search-project/state/${searchTerm}`);
          console.log(response)
          const projects = await response.json();
          renderProjects(projects);
        } catch (error) {
          console.error('Error searching projects:', error);
        }
      }
    };

    const renderProjects = (projects) => {
      searchResults.innerHTML = '';

      projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        projectElement.innerHTML = `
          <h3>${project.nameProject}</h3>
          <p>${project.descriptionProject}</p>
          <p>${project.stateProject}</p>
        `;
        searchResults.appendChild(projectElement);
      });
    };

    searchButton.addEventListener('click', handleSearch);

    return () => {
      searchButton.removeEventListener('click', handleSearch);
    };
  }, []);

  return (
    <div className="project-filter">
      <input type="text" id="searchInput" placeholder="Search projects..." />
      <button id="searchButton">Search</button>
      <div id="searchResults"></div>
    </div>
  );
};

export default ProjectFilter;
