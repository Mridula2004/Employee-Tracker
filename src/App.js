// src/App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Employee from './components/Employee';
import AssignedProjects from './components/AssignedProjects';
import Statistics from './components/Statistics';
import Projects from './components/Projects';

const App = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('welcome');

  const handleNavigate = (page) => {
    if (page === 'logout') {
      setRole('');
      setUsername('');
      setCurrentPage('welcome');
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome />;
      case 'login':
        return <Login setRole={setRole} setUsername={setUsername} onNavigate={handleNavigate} />;
      case 'contact':
        return (
          <div className="contact-content">
                <h1>Contact Us</h1>
                <p>
                  Welcome to our Contact Us page! We're delighted to hear from you. Whether you have questions about our products, services, or you just want to say hello, we're here to help. Please feel free to reach out to us through any of the channels below:
                </p>
                <h2>Our Contact Details</h2>
                <ul>
                  <li><strong>Email:</strong> info@example.com</li>
                  <li><strong>Phone:</strong> +1234567890</li>
                  <li><strong>Address:</strong> 123 Main Street, Cityville, Country</li>
                </ul>
                <h2>Office Hours</h2>
                <p>
                  Our office is open from Monday to Friday, 9:00 AM to 5:00 PM. We're closed on weekends and public holidays.
                </p>
                <h2>Get in Touch</h2>
                <p>
                  We value your feedback and inquiries. Please don't hesitate to contact us using the form below or visit our office during business hours.
                </p>
              </div>
        );
      case 'about':
        return (
          <div className="about-us-content">
                <h1>About Our Employee Tracker App</h1>
                <p>Our Employee Tracker App simplifies and enhances employee management for organizations of all sizes. Designed to streamline HR operations, it offers essential features to boost productivity and efficiency.</p>
                <h2>Key Features</h2>
                <ul>
                  <li><strong>Employee Database:</strong> Manage employee information and employment history efficiently.</li>
                  <li><strong>Attendance Tracking:</strong> Monitor employee attendance and punctuality effortlessly.</li>
                  <li><strong>Task Management:</strong> Assign tasks and projects, track progress, and manage deadlines.</li>
                  <li><strong>Leave Management:</strong> Handle leave requests and approvals seamlessly.</li>
                  <li><strong>Performance Evaluation:</strong> Conduct performance reviews and set goals effectively.</li>
                  <li><strong>Reporting and Analytics:</strong> Generate insightful reports on employee performance and productivity.</li>
                  <li><strong>Mobile Access:</strong> Stay connected and manage tasks on-the-go with mobile-friendly features.</li>
                </ul>
                <h2>Why Choose Our App?</h2>
                <p>Our app prioritizes user-friendly design and functionality, making it easy for HR professionals to manage employees efficiently. Join numerous organizations benefiting from our innovative approach to employee management.</p>
              </div>
        );
      case 'employee':
        return <Employee />;
      case 'assigned-projects':
        return <AssignedProjects username={username} />;
      case 'statistics':
        return <Statistics />;
      case 'projects':
        return <Projects />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div>
      <Navbar role={role} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
};

export default App;
