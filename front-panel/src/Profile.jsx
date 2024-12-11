import React, { useState, useEffect } from 'react';
import { handleEditNickname, fetchUserData } from './api/response';

function Profile() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState({ firstname: '', secondname: '', thirdname: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserData(name, setUser, setName);
    }, []);


    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Профиль пользователя</h2>

            {isEditing ? (
                <div>
                    <div>
                        <input type="text" value={name.firstname} onChange={(e) => setName({ ...name, firstname: e.target.value })} />
                        <input type="text" value={name.secondname} onChange={(e) => setName({ ...name, secondname: e.target.value })} />
                        <input type="text" value={name.thirdname} onChange={(e) => setName({ ...name, thirdname: e.target.value })} />
                    </div>
                    <button onClick={() => handleEditNickname(user, name, setUser, setIsEditing)}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>ФИО: {user.firstname || user.nickname || 'Not set'} {user.secondname || user.nickname || 'Not set'}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Nickname</button>
                </div>
            )}

        </div>
    );
}

export default Profile;