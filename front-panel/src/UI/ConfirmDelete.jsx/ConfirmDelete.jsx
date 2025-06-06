import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './ConfirmDelete.module.css';

const ConfirmDelete = ({confirm, setConfirm, deleteFunc}) => {
    return (
        <Modal active={confirm} setActive={setConfirm} parentClass={styles.modal}>
            <div>
                Вы точно хотите удалить это?
                Это действие нельзя будет отменить
            </div>
            <div>
                <Button onClick={() => setConfirm(false)}>
                    Нет, отменить
                </Button>
                <Button onClick={deleteFunc}>
                    Да, удалить
                </Button>
            </div>
        </Modal>
    );
}

export default ConfirmDelete;