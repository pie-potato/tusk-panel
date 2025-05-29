import axios from "axios"

export const fetchProjects = async (setProjects) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const response = await axios.get(`http://${process.env.PUBLIC_BACKEND_URL}/api/project`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setProjects(response.data);
    } catch (error) {
        console.log(error);
    }
};

export const createProject = async (title, members = []) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.post(`http://${process.env.PUBLIC_BACKEND_URL}/api/project`, { title: title, members: members }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteProject = async (projectId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.delete(`http://${process.env.PUBLIC_BACKEND_URL}/api/project/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteMemberFromProject = async (projectId, userId) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/project/${projectId}/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProject = async (projectId, title, members) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    try {
        await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/project/${projectId}`, {title: title, members: members}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error)
    }
}