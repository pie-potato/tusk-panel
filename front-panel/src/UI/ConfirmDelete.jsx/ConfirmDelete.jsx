import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './ConfirmDelete.module.css';
import { useModal } from '../../contexts/ModalContext';

const ConfirmDelete = () => {

    const { confirmDelete, confirmClose } = useModal()
    const { isOpen, deleteFunc } = confirmDelete

    return (
        <Modal active={isOpen} setActive={confirmClose} parentClass={styles.modal}>
            <div>
                Вы точно хотите удалить это?
                Это действие нельзя будет отменить
            </div>
            <div>
                <Button onClick={() => confirmClose()}>
                    Нет, отменить
                </Button>
                <Button onClick={() => {
                    deleteFunc()
                    confirmClose()
                }}>
                    Да, удалить
                </Button>
            </div>
        </Modal>
    );
}

export default ConfirmDelete;