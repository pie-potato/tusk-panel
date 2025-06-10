import axios from '../../configs/axiosConfig'

export const fetchUsers = async () => {
    try {
        return await axios.get(`/api/user`)
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export const fetchUserProfile = async () => {
    try {
        return await axios.get(`/api/user/profile`)
    } catch (error) {
        console.error(error);
    }
}

export const getUsersFromAdmin = async () => {
    try {
        return await axios.get(`/api/user/admin`)
    } catch (error) {
        console.log(error)
    }
}

export const createUser = async (newUser) => {
    try {
        await axios.post(`/api/user/admin`, newUser)
    } catch (error) {
        console.error(error);
    }
};

export const editNickname = async (name, setUser, setIsEditing) => {
    try {
        await axios.put(`/api/user/profile`, name)
        setUser(name);
        setIsEditing(false);
    } catch (error) {
        console.error(error);
    }
};

export const updateUser = async (editingUser, editPassword) => {
    try {
        await axios.put(`/api/user/admin/${editingUser._id}`, { ...editingUser, password: editPassword })
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (credentials) => {
    try {
        return await axios.post(`/api/user/login`, credentials);
    } catch (error) {
        // console.error("Login error:", error);
        return error
    }
};

export const logoutUser = async () => {
    try {
        return await axios.post(`/api/user/logout`);
    } catch (error) {
        // console.error("Login error:", error);
        return error
    }
};