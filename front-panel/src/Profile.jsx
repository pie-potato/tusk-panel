import React, { useState, useEffect } from 'react';
import { handleEditNickname, fetchUserData } from './api/response';

function Profile() {
    const [user, setUser] = useState(null);
    const [newNickname, setNewNickname] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserData(setUser, setNewNickname);
    }, []);


    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>My Profile</h2>

            {isEditing ? (
                <div>
                    <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                    <button onClick={() => handleEditNickname(user, newNickname, setUser, setIsEditing)}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>Nickname: {user.nickname || 'Not set'}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Nickname</button>
                </div>
            )}

        </div>
    );
}

export default Profile;