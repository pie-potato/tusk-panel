import { useState } from 'react';
import styles from "../../styles/Login.module.css"
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import { loginUser } from '../api/response/userResponse';
import { useUser } from '../contexts/UserContext';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const { setUser } = useUser()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginUser({ username, password })
        if (response?.status === 401 || response?.status === 404) return setInvalidCredentials(true)
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
    };

    return (
        <div className={styles.login}>
            <h1>Вход</h1>
            <form onSubmit={handleSubmit} className={styles.login_form}>
                {invalidCredentials && <div className={styles.invalid_credentials}>Неправильный логин или пароль</div>}
                <div className={styles.login_element}>
                    <label htmlFor="username">Имя пользователя:</label>
                    <Input
                        className={styles.login_input}
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.login_element}>
                    <label htmlFor="password">Пароль:</label>
                    <Input
                        className={styles.login_input}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit"><h3>Войти</h3></Button>
            </form>
        </div>
    );
}

export default Login;