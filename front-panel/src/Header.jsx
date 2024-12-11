import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css"

export default function Header({ handleLogout }) {
    return (
        <header className="header">
            <div className="header_link">
                {!JSON.parse(localStorage.getItem('user')) && (
                    <>
                        <Link to="/register">Зарегистрироваться</Link>
                        <Link to="/login">Войти</Link>
                    </>
                )}
                {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
                        <Link to="/admin">Панель администратора</Link>
                )}
                {JSON.parse(localStorage.getItem('user')) && (
                    <>
                        <Link to="/">Доска задач</Link>
                        <Link to="/profile">Профиль</Link>
                    </>
                )}
            </div>
            {JSON.parse(localStorage.getItem('user'))?.username && (
                <>
                    <div className="user_info">
                        <p>Вы вошли как: {JSON.parse(localStorage.getItem('user'))?.firstname
                            ? <>{JSON.parse(localStorage.getItem('user')).firstname} {JSON.parse(localStorage.getItem('user')).secondname}</>
                            : JSON.parse(localStorage.getItem('user')).username
                        }</p>
                        <button className="logout_button" onClick={handleLogout}>Выйти</button>
                    </div>
                </>
            )}
        </header>
    )
}