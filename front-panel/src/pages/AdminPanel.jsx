import { useEffect, useState } from 'react';
import { createUser, getUsersFromAdmin, updateUser } from '../api/response/userResponse';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Modal from '../UI/Modal/Modal';
import styles from '../../styles/Admin.module.css'
import { useMemo } from 'react';

function AdminPanel() {
    const [newUser, setNewUser] = useState({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
    const [editPassword, setEditPassword] = useState('');
    const [active, setActive] = useState(false)
    const [notValid, setNotValid] = useState(false)
    const [editingActive, setEditingActive] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([]);

    const filteredUser = useMemo(() => {
        if (!searchTerm) users
        return users.filter(e => e?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || e?.secondname.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [searchTerm, users])

    const getUsers = async () => {
        const users = await getUsersFromAdmin()
        setUsers(users.data)
    }

    useEffect(() => {
        getUsers()
    }, [])

    const editUser = (user) => {
        setEditingUser(user)
        setEditPassword('')
        setEditingActive(true)
    };

    const cancelEdit = () => {
        setEditingActive(false)
        setEditingUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
        setEditPassword('');
    };

    const buildUser = () => {
        if (newUser.username.length === 0 || newUser.password.length === 0 || newUser.firstname.length === 0 || newUser.secondname.length === 0) {
            setNotValid(true)
            return;
        }
        else {
            createUser(newUser)
            setNewUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
        }
    }

    const updetaUserInformation = () => {
        updateUser(editingUser, editPassword)
        setEditingUser({ username: '', firstname: '', secondname: '', thirdname: '', password: '', mail: '', role: 'employee' });
        setEditPassword('');
        setEditingActive(false)
    }

    return (
        <div className={styles.admin}>
            <h2>Панель админа</h2>
            <div>
                <Button onClick={() => setActive(true)}>Создать нового пользователя</Button>
                <Modal active={active} setActive={setActive} childrenClass={styles.modal_cteate_user}>
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
                    <Button onClick={buildUser}>Создать пользоваетля</Button>
                </Modal>
            </div>
            <div>
                <h3>Пользователи</h3>
                <div>
                    <div>Поиск пользователя</div>
                    <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div>
                    {filteredUser.map((user) => (
                        <div key={user._id} className={styles.user}>
                            <div>{user?.firstname} {user?.secondname} {user?.thirdname} ({user.username})  - {user.role}</div>
                            <Button onClick={() => editUser(user)}>Редактировать</Button>
                        </div>
                    ))}
                </div>
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
                <Button onClick={updetaUserInformation}>Обновить</Button>
                <Button onClick={cancelEdit}>Закрыть</Button>
            </Modal>
        </div>
    );
}
export default AdminPanel;