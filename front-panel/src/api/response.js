import axios from "../configs/axiosConfig";

export const handleEditNickname = async (name, setUser, setIsEditing) => {
  try {
    await axios.put(`/api/user/profile`, name)
    setUser(name);
    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};