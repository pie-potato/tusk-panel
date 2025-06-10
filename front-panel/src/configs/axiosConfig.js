import axios from 'axios';

// Глобальные настройки Axios
axios.defaults.baseURL = process.env.PUBLIC_BACKEND_URL;  // Базовый URL
axios.defaults.timeout = 5000;  // Таймаут 5 секунд
// axios.defaults.headers.common['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true
// Добавляем интерцепторы (опционально)
// axios.interceptors.request.use(
//     (config) => {
//         // Можно добавить токен авторизации
//         const token = JSON.parse(localStorage.getItem('user'))?.token;
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Обработка ошибок (например, 401 - перенаправление на логин)
//         if (error.response?.status === 401) {
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default axios;