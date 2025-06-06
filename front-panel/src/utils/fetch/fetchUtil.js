import axios from "axios";

const getFetch = async (url) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (!token) throw new Error("Нет токена")
        return await axios.get(`${process.env.PUBLIC_BACKEND_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error(error)
    }
}

const postFetch = async (url, body) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (!token) throw new Error("Нет токена")
        if (body) {
            return await axios.post(`${process.env.PUBLIC_BACKEND_URL}${url}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }
        return await axios.post(`${process.env.PUBLIC_BACKEND_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error(error)
    }
}

const putFetch = async (url, body) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (!token) throw new Error("Нет токена")
        if (body) {
            return await axios.put(`${process.env.PUBLIC_BACKEND_URL}${url}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }
        return await axios.put(`${process.env.PUBLIC_BACKEND_URL}${url}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error(error)
    }
}

const deleteFetch = async (url, body) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (!token) throw new Error("Нет токена")
        if (body) {
            return await axios.delete(`${process.env.PUBLIC_BACKEND_URL}${url}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        }
        return await axios.delete(`${process.env.PUBLIC_BACKEND_URL}${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        console.error(error)
    }
}

export { getFetch, postFetch, putFetch, deleteFetch }