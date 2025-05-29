import React, { useState } from 'react';
import "/styles/Login.css"

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin({ username, password });
    };

    return (
        <div className='login'>
            <h1>Вход</h1>
            <form onSubmit={handleSubmit} className='login_form'>
                <div className='login_element'>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        className='login_input'
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='login_element'>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        className='login_input'
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='submit_button'><h3>Войти</h3></button>
            </form>
        </div>
    );
}

export default Login;