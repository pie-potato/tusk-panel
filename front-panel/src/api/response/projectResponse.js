import { deleteFetch, getFetch, postFetch, putFetch } from "../../utils/fetch/fetchUtil";
import axios from '../../configs/axiosConfig'

export const fetchProjects = async () => {
    try {
        return await axios.get(`/api/project`)
    } catch (error) {
        console.error(error);
    }
}

export const createProject = async (title, members = []) => {
    try {
        return await axios.post(`/api/project`, { title: title, members: members })
    } catch (error) {
        console.error(error);
    }
}

export const deleteProject = async (projectId) => {
    try {
        return await axios.delete(`/api/project/${projectId}`)
    } catch (error) {
        console.error(error);
    }
}

export const deleteMemberFromProject = async (projectId, userId) => {
    try {
        return await axios.put(`/api/project/${projectId}/${userId}`)
    } catch (error) {
        console.error(error);
    }
}

export const updateProject = async (projectId, title, members) => {
    try {
        return await axios.put(`/api/project/${projectId}`, { title: title, members: members })
    } catch (error) {
        console.error(error);
    }
}