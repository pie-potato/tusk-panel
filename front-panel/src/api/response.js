import axios from "axios";

export const fetchColumns = async () => {
  try {
    const response = await axios.get(`http://${process.env.PUBLIC_BACKEND_URL}/api/columns`);
    return response
  } catch (error) {
    console.error('Error fetching columns:', error);
  }
};

export const fetchUsers = async (setUsers) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${process.env.PUBLIC_BACKEND_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const handleCreateUser = async (newUser, setNewUser) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  try {
    await axios.post(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/admin`, newUser, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      }
    });
    setNewUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    // alert('User created successfully!');  // Или другое уведомление об успехе
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const handleUpdateRole = async (userId, newRole) => {
  try {
    await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/admin/role/${userId}`, { role: newRole });
  } catch (error) {
    console.log(error);

  }
};

export const handleEditNickname = async (user, name, setUser, setIsEditing) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/profile`, name, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(name);
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating nickname:", error);
  }
};

export const fetchUserData = async (setUser) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/profile`, { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getUsers = async (setUsers) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
  try {
    const response = await axios.get(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/admin`, { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const handleUpdateUser = async (editingUser, editPassword, setEditingUser, setEditPassword) => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

  try {

    const updateData = editingUser;

    if (editPassword) { // Only send password if it's changed
      updateData.password = editPassword;
    }

    await axios.put(`http://${process.env.PUBLIC_BACKEND_URL}/api/user/admin/${editingUser._id}`, updateData, { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEditingUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    setEditPassword('');
  } catch (error) {
    console.log(error);
  }
};