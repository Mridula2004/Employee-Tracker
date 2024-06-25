// src/components/Projects.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Project.css'; // Import CSS for component-specific styles
import { FaTrash, FaPlus } from 'react-icons/fa'; // Import FontAwesome icons for trash and plus

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    hours_assigned: '',
    employees_assigned: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/project/');
        console.log('API response:', response.data);
        setProjects(response.data.project || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/employee/');
        console.log('API response:', response.data);
        setEmployees(response.data.Employees || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchProjects();
    fetchEmployees();
  }, []);

  const toggleDetails = (index) => {
    const updatedProjects = [...projects];
    updatedProjects[index].showDetails = !updatedProjects[index].showDetails;
    setProjects(updatedProjects);
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/project/${id}`);
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewProject(prevState => ({
        ...prevState,
        employees_assigned: prevState.employees_assigned
          ? prevState.employees_assigned + ',' + value
          : value
      }));
    } else {
      setNewProject(prevState => ({
        ...prevState,
        employees_assigned: prevState.employees_assigned
          .split(',')
          .filter(name => name !== value)
          .join(',')
      }));
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/project/', newProject);
      console.log('New project added:', response.data);
      setProjects([...projects, response.data]);
      setShowAddForm(false);
      setNewProject({
        name: '',
        hours_assigned: '',
        employees_assigned: ''
      });
    } catch (error) {
      console.error('Error adding new project:', error);
    }
  };

  return (
    <div className="project-container">
      <h1>Project List</h1>
      <div className="add-project">
        {!showAddForm ? (
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Add Project
          </button>
        ) : (
          <div className="add-form">
            <h2>Add New Project</h2>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={newProject.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="hours_assigned">Hours Assigned:</label>
              <input type="text" id="hours_assigned" name="hours_assigned" value={newProject.hours_assigned} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Employees Assigned:</label>
              <ul className="checkbox-list">
                {employees.map(employee => (
                  <li key={employee.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={employee.name}
                        checked={newProject.employees_assigned.includes(employee.name)}
                        onChange={handleCheckboxChange}
                      />{' '}
                      {employee.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="form-actions">
              <button className="add-button" onClick={handleAddProject}>Add</button>
              <button className="cancel-button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <ul className="project-list">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <li key={project.id} className="project-item">
              <div className="project-header">
                <h2 onClick={() => toggleDetails(index)} className="project-name">{project.name}</h2>
                <button onClick={() => handleDeleteProject(project.id)} className="delete-button">
                  <FaTrash />
                </button>
              </div>
              {project.showDetails && (
                <div className="details-container">
                  <p><strong>Hours Assigned:</strong> {project.hours_assigned}</p>
                  <p><strong>Employees Assigned:</strong> {project.employees_assigned}</p>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </ul>
    </div>
  );
};

export default Projects;
