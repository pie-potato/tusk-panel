import axios from "axios";

export const fetchColumns = async () => {
  try {
    const response = await axios.get(`http://${window.location.hostname}/api/columns`);
    return response
  } catch (error) {
    console.error('Error fetching columns:', error);
  }
};

export const fetchUsers = async (setUsers) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${window.location.hostname}/api/user`, {
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
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.post(`http://${window.location.hostname}/api/user/admin`, newUser, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      }
    });
    setNewUser({ username: '', password: '', role: 'employee' });
    alert('User created successfully!');  // Или другое уведомление об успехе
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const handleUpdateRole = async (userId, newRole) => {
  try {
    await axios.put(`http://${window.location.hostname}/api/user/admin/role/${userId}`, { role: newRole });
  } catch (error) {
    console.log(error);

  }
};

export const handleEditNickname = async (user, name, setUser, setIsEditing) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    await axios.put(`http://${window.location.hostname}/api/user/profile`, name, {
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

export const fetchUserData = async (name, setUser, setNewNickname) => {
  try {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const response = await axios.get(`http://${window.location.hostname}/api/user/profile`, { // New route for profile data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
    setNewNickname({ ...name, firstname: response.data.firstame || '' }); // Set initial nickname
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getUsers = async (setUsers) => {
  try {
    const response = await axios.get(`http://${window.location.hostname}/api/user/admin`);
    setUsers(response.data)
  } catch (error) {
    console.log(error)
  }
}

export const handleUpdateUser = async (editingUser, editPassword, setEditingUser, setEditPassword) => {
  try {

    const updateData = { role: editingUser.role };

    if (editPassword) { // Only send password if it's changed
      updateData.password = editPassword;
    }

    await axios.put(`http://${window.location.hostname}/api/user/admin/${editingUser._id}`, updateData);
    setEditingUser(null);
    setEditPassword('');
  } catch (error) {
    console.log(error);
  }
};