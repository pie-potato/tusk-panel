import axios from "../configs/axiosConfig";

export const handleCreateUser = async (newUser, setNewUser) => {
  try {
    await axios.post(`/api/user/admin`, newUser)
    setNewUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
  } catch (error) {
    console.error(error);
  }
};

export const handleEditNickname = async (name, setUser, setIsEditing) => {
  try {
    await axios.put(`/api/user/profile`, name)
    setUser(name);
    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};

export const handleUpdateUser = async (editingUser, editPassword, setEditingUser, setEditPassword) => {
  try {
    const updateData = editingUser;
    if (editPassword) { // Only send password if it's changed
      updateData.password = editPassword;
    }
    await axios.put(`/api/user/admin/${editingUser._id}`, updateData)
    setEditingUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    setEditPassword('');
  } catch (error) {
    console.log(error);
  }
};