import React, { useEffect, useState } from 'react';
import { getUsers, handleCreateUser, handleUpdateUser } from './api/response';

function AdminPanel() {
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'employee' });
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null);
    const [editPassword, setEditPassword] = useState('');

    useEffect(() => {
        getUsers(setUsers)
    }, [users])

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditPassword(''); // Clear password field when starting edit
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditPassword('');
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <div>
                <h3>Create New User</h3>
                <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="New username"
                />
                <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="New password"
                />
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                </select>
                <button onClick={() => handleCreateUser(newUser, setNewUser)}>Create User</button>
            </div>
            <div>
                <h3>Users</h3>
                {users.map((user) => (
                    <div key={user._id}>
                        {editingUser?._id === user._id ? ( // Edit form
                            <div>
                                <p>Username: {user.username}</p>
                                <input
                                    type="password"
                                    placeholder="New Password (optional)"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                />
                                <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="employee">Employee</option>
                                </select>
                                <button onClick={() => handleUpdateUser(editingUser, editPassword, setEditingUser, setEditPassword)}>Update</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        ) : ( // Display user info
                            <div>
                                <p>{user.username} ({user.nickname || 'No nickname'}) - {user.role}</p>
                                <button onClick={() => handleEditUser(user)}>Edit</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default AdminPanel;