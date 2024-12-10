import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error); // Show error from server
            } else {
                alert("An error occurred during registration.");
            }
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
            <div>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Register;