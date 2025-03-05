import axios from "axios"

export const fetchProjects = async (setProjects) => {
    try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const response = await axios.get(`http://${window.location.hostname}/api/project`, {
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
        await axios.post(`http://${window.location.hostname}/api/project`, { title: title, members: members }, {
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
        await axios.delete(`http://${window.location.hostname}/api/project/${projectId}`, {
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
        await axios.put(`http://${window.location.hostname}/api/project/${projectId}/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error)
    }
}