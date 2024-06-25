// src/components/Statistics.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Statistics = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [bestEmployee, setBestEmployee] = useState(null);
  const combinedChartRef = useRef(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/employee/');
        console.log('API response:', response.data);
        const data = response.data.Employees;

        setEmployeeData(data);
        determineBestEmployee(data);
        renderChart(combinedChartRef.current, data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  const determineBestEmployee = (data) => {
    let best = null;
    let maxProjects = 0;
    let maxHours = 0;

    data.forEach((employee) => {
      const projects = calculateProjectsDone(employee);
      const hours = calculateHoursAssigned(employee);

      if (projects > maxProjects || (projects === maxProjects && hours > maxHours)) {
        best = employee;
        maxProjects = projects;
        maxHours = hours;
      }
    });

    setBestEmployee(best);
  };

  const calculateProjectsDone = (employee) => {
    if (!employee.projects_done) return 0;
    if (employee.projects_done === '-') return 0;
    
    return employee.projects_done.split(',').length;
  };

  const calculateHoursAssigned = (employee) => {
    if (!employee.hours_assigned) return 0;
    
    return employee.hours_assigned.split(',').reduce((sum, hour) => sum + parseInt(hour.trim(), 10), 0);
  };

  const renderChart = (chartRef, data) => {
    if (!chartRef || !data) return;

    const employeeNames = data.map((emp) => emp.name);
    const projectCounts = data.map((emp) => calculateProjectsDone(emp));
    const hoursAssigned = data.map((emp) => calculateHoursAssigned(emp));

    const chartData = {
      labels: employeeNames,
      datasets: [
        {
          label: 'Projects Done',
          data: projectCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Hours Assigned',
          data: hoursAssigned,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };

    if (chartRef.chart) {
      chartRef.chart.destroy();
    }

    chartRef.chart = new Chart(chartRef, {
      type: 'bar',
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Employees',
            },
          },
        },
      },
    });
  };

  return (
    <div className="statistics-container">
      <h1>Employee Statistics</h1>
      <div className="charts">
        <div className="chart">
          <h3>Projects Done & Hours Assigned</h3>
          <canvas ref={combinedChartRef}></canvas>
        </div>
      </div>
      <div className="best-employee">
        {bestEmployee && (
          <div>
            <h2>Best Employee</h2>
            <p>Name: {bestEmployee.name}</p>
            <p>Position: {bestEmployee.position}</p>
            <p>Department: {bestEmployee.department}</p>
            <p>Projects Done: {calculateProjectsDone(bestEmployee)}</p>
            <p>Hours Assigned: {calculateHoursAssigned(bestEmployee)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
