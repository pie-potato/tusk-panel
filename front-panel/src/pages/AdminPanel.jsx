import { useEffect, useState } from 'react';
import { getUsers, handleCreateUser, handleUpdateUser } from '../api/response';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import styles from '../../styles/Admin.module.css'

function AdminPanel() {
    const [newUser, setNewUser] = useState({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    const [editPassword, setEditPassword] = useState('');
    const [active, setActive] = useState(false)
    const [notValid, setNotValid] = useState(false)
    const [editingActive, setEditingActive] = useState(false)

    useEffect(() => {
        getUsers(setUsers)
    }, [])

    const handleEditUser = (user) => {
        setEditingUser(user)
        setEditPassword('')
        setEditingActive(true)
    };

    const handleCancelEdit = () => {
        setEditingUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
        setEditPassword('');
    };

    const createUser = () => {
        if (newUser.username.length === 0 || newUser.password.length === 0 || newUser.firstname.length === 0 || newUser.secondname.length === 0) {
            setNotValid(true)
            return;
        }
        else {
            handleCreateUser(newUser, setNewUser)
        }
    }

    return (
        <div>
            <h2>Панель админа</h2>
            <div>
                <Button onClick={() => setActive(true)}>Создать нового пользователя</Button>
                <Modal active={active} setActive={setActive} className={styles.modal_cteate_user}>
                    <div className={styles.create_user}>
                        <div className={styles.fst}>
                            <div>
                                <div>Имя*</div>
                                <Input
                                    type="text"
                                    value={newUser.firstname}
                                    onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                                    placeholder="New username"
                                    className={notValid && newUser.firstname.length === 0 && styles.not_valid}
                                />
                                {notValid && newUser.firstname.length === 0 && <div>Это обязательное поле</div>}
                            </div>
                            <div>
                                <div>Фамилия*</div>
                                <Input
                                    type="text"
                                    value={newUser.secondname}
                                    onChange={(e) => setNewUser({ ...newUser, secondname: e.target.value })}
                                    placeholder="New username"
                                    className={notValid && newUser.secondname.length === 0 && styles.not_valid}
                                />
                                {notValid && newUser.secondname.length === 0 && <div>Это обязательное поле</div>}
                            </div>
                            <div>
                                <div>Отчество</div>
                                <Input
                                    type="text"
                                    value={newUser.thirdname}
                                    onChange={(e) => setNewUser({ ...newUser, thirdname: e.target.value })}
                                    placeholder="New username"
                                />
                            </div>
                            <div>
                                <div>Почта</div>
                                <Input
                                    type="text"
                                    value={newUser.mail}
                                    onChange={(e) => setNewUser({ ...newUser, mail: e.target.value })}
                                    placeholder="New username"
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>Логин*</div>
                                <Input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="New username"
                                    className={notValid && newUser.username.length === 0 && styles.not_valid}
                                />
                                {notValid && newUser.username.length === 0 && <div>Это обязательное поле</div>}
                            </div>
                            <div>
                                <div>Пароль пользователя*</div>
                                <Input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="New password"
                                    className={notValid && newUser.password.length === 0 && styles.not_valid}
                                />
                                {notValid && newUser.password.length === 0 && <div>Это обязательное поле</div>}
                            </div>
                        </div>
                        <div>
                            <div>Роль</div>
                            <select className={styles.select_role} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="admin">Админ</option>
                                <option value="manager">Менеджер</option>
                                <option value="employee">Работник</option>
                            </select>
                        </div>
                    </div>
                    <Button onClick={createUser}>Создать пользоваетля</Button>
                </Modal>
            </div>
            <div>
                <h3>Пользователи</h3>
                {users.map((user) => (
                    <div key={user._id}>

                        <div>
                            <p>{user?.firstname} {user?.secondname} {user?.thirdname} ({user.username})  - {user.role}</p>
                            <Button onClick={() => handleEditUser(user)}>Редактировать</Button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal active={editingActive} setActive={setEditingActive}>
                <div className={styles.create_user}>
                    <div className={styles.fst}>
                        <div>
                            <div>Имя</div>
                            <Input
                                type="text"
                                value={editingUser.firstname}
                                onChange={(e) => setEditingUser({ ...editingUser, firstname: e.target.value })}
                                placeholder="New username"
                            />
                        </div>
                        <div>
                            <div>Фамилия</div>
                            <Input
                                type="text"
                                value={editingUser.secondname}
                                onChange={(e) => setEditingUser({ ...editingUser, secondname: e.target.value })}
                                placeholder="New username"
                            />
                        </div>
                        <div>
                            <div>Отчество</div>
                            <Input
                                type="text"
                                value={editingUser.thirdname}
                                onChange={(e) => setEditingUser({ ...editingUser, thirdname: e.target.value })}
                                placeholder="New username"
                            />
                        </div>
                        <div>
                            <div>Почта</div>
                            <Input
                                type="text"
                                value={editingUser.mail}
                                onChange={(e) => setEditingUser({ ...editingUser, mail: e.target.value })}
                                placeholder="New username"
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Логин</div>
                            <Input
                                type="text"
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                placeholder="New username"
                            />
                        </div>
                        <div>
                            <div>Пароль пользователя</div>
                            <Input
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="New password"
                            />
                        </div>
                    </div>
                    <div>
                        <div>Роль</div>
                        <select className={styles.select_role} value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                            <option value="admin">Админ</option>
                            <option value="manager">Менеджер</option>
                            <option value="employee">Работник</option>
                        </select>
                    </div>
                </div>
                <Button onClick={() => {
                    handleUpdateUser(editingUser, editPassword, setEditingUser, setEditPassword)
                    setEditingActive(false)
                }}>Обновить</Button>
                <Button onClick={handleCancelEdit}>Закрыть</Button>
            </Modal>
        </div>
    );
}
export default AdminPanel;