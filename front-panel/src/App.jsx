import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import TaskBoard from './TaskBoard'; // Новый компонент для доски задач
import AdminPanel from './AdminPanel';
import Header from './Header';
import Profile from './Profile';



function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(user);
  

  useEffect(() => {
    const fetchUser = async () => { // Make function async
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // JSON.parse(localStorage.getItem('user'))?.username
      }
      setIsLoading(false); // Set loading to false after fetching user
    };
    fetchUser(); // Call the async function
  }, []);

  if (isLoading) {  // Display loading message while fetching user data
    return <div>Loading...</div>;
  }

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', credentials);
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials"); // or more detailed error handling
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };




  return (
    <Router>
      <Header handleLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={user ? <TaskBoard /> : <Navigate to="/login" />} /> {/* Перенаправление на /login, если пользователь не авторизован */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;