import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employee.css'; // Import CSS for component-specific styles
import { FaTrash, FaPlus } from 'react-icons/fa'; // Import FontAwesome icons for trash and plus

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/employee/');
        console.log('API response:', response.data);
        setEmployees(response.data.Employees); // Assuming API returns data in the format { "Employees": [...] }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array ensures useEffect runs only once

  const toggleDetails = (index) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index].showDetails = !updatedEmployees[index].showDetails;
    setEmployees(updatedEmployees);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/employee/${id}`);
      const updatedEmployees = employees.filter(employee => employee.id !== id);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddEmployee = async () => {
    const employeeToAdd = {
      ...newEmployee,
      projects_done: "null",
      hours_assigned: "null"
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/employee/', employeeToAdd);
      console.log('New employee added:', response.data);

      if (response.data && response.data.id) {
        setEmployees([...employees, response.data]);
        setShowAddForm(false);
        setNewEmployee({
          name: '',
          position: '',
          department: ''
        });

        // Add login credentials
        const loginCredentials = {
          username: employeeToAdd.name, // Assuming the name will be used as the username
          password: employeeToAdd.name, // Assuming the name will be used as the password
          role: 'Employee'
        };

        const loginResponse = await axios.post('http://127.0.0.1:8000/logins/', loginCredentials);
        console.log('Login credentials added:', loginResponse.data);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error adding new employee:', error);
    }
  };

  return (
    <div className="employee-container">
      <h1>Employee List</h1>
      <div className="add-employee">
        {!showAddForm ? (
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Add Employee
          </button>
        ) : (
          <div className="add-form">
            <h2>Add New Employee</h2>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" value={newEmployee.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position:</label>
              <input type="text" id="position" name="position" value={newEmployee.position} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <input type="text" id="department" name="department" value={newEmployee.department} onChange={handleInputChange} />
            </div>
            <div className="form-actions">
              <button onClick={handleAddEmployee}>Add</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      <ul className="employee-list">
        {employees.map((employee, index) => (
          <li key={employee.id} className="employee-item">
            <div className="employee-header">
              <h2 onClick={() => toggleDetails(index)} className="employee-name">{employee.name}</h2>
              <button onClick={() => handleDeleteEmployee(employee.id)} className="delete-button">
                <FaTrash />
              </button>
            </div>
            {employee.showDetails && (
              <div className="details-container">
                <p><strong>Position:</strong> {employee.position}</p>
                <p><strong>Department:</strong> {employee.department}</p>
                {employee.projects_done && employee.hours_assigned && (
                  <table className="details-table">
                    <thead>
                      <tr>
                        <th>Projects Done</th>
                        <th>Hours Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.projects_done.split(',').map((project, idx) => (
                        <tr key={idx}>
                          <td>{project.trim()}</td>
                          <td>{employee.hours_assigned.split(',')[idx].trim()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employee;
