import { useState, useEffect } from 'react';
import { handleEditNickname, fetchUserData } from './api/response';
import Input from './UI/Input/Input';
import Button from './UI/Button/Button';
import Modal from './UI/Modal/Modal';

function Profile() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState({ firstname: '', secondname: '', thirdname: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserData(setUser);
    }, []);


    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Профиль пользователя</h2>
            <Modal active={isEditing} setActive={setIsEditing}>
                <div>
                    <div>
                        <div>
                            <div>Имя</div>
                            <Input type="text" value={user.firstname} onChange={(e) => setUser({ ...user, firstname: e.target.value })} />
                        </div>
                        <div>
                            <div>Фамилия</div>
                            <Input type="text" value={user.secondname} onChange={(e) => setUser({ ...user, secondname: e.target.value })} />
                        </div>
                        <div>
                            <div>Отчество</div>
                            <Input type="text" value={user.thirdname} onChange={(e) => setUser({ ...user, thirdname: e.target.value })} />
                        </div>
                    </div>
                    <Button onClick={() => handleEditNickname(user, name, setUser, setIsEditing)}>Сохранить</Button>
                    <Button onClick={() => setIsEditing(false)}>Закрыть</Button>
                </div>
            </Modal>
            <div>
                <p>ФИО: {user.firstname || user.username || 'Not set'} {user.secondname || user.username || 'Not set'}</p>
                <Button onClick={() => setIsEditing(true)}>Редактировать ФИО</Button>
            </div>

        </div>
    );
}

export default Profile;