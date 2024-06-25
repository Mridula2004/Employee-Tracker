// src/components/AssignedProjects.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignedProjects.css'; // Import CSS for component-specific styles

const AssignedProjects = ({ username }) => {
  const [projects, setProjects] = useState([]);
  const [hoursAssigned, setHoursAssigned] = useState([]);
  const [noProjects, setNoProjects] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/employee/');
        console.log('API response:', response.data);

        const employee = response.data.Employees.find(emp => emp.name === username);

        if (employee) {
          if (employee.projects_done && employee.hours_assigned) {
            const projectsList = employee.projects_done.split(',');
            const hoursList = employee.hours_assigned.split(',');
            if (projectsList.length > 0 && hoursList.length > 0) {
              setProjects(projectsList);
              setHoursAssigned(hoursList);
            } else {
              setNoProjects(true);
            }
          } else {
            setNoProjects(true);
          }
        } else {
          setNoProjects(true);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setNoProjects(true);
      }
    };

    fetchProjects();
  }, [username]);

  return (
    <div className="assigned-projects-container">
      <h1><b>Hello {username} !!!</b></h1>
      <h2>Assigned Projects</h2>
      {noProjects ? (
        <p>No projects assigned.</p>
      ) : (
        <table className="assigned-projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Hours Assigned</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.trim()}</td>
                <td>{hoursAssigned[index] ? hoursAssigned[index].trim() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedProjects;
