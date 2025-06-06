import { createPortal } from "react-dom";
import styles from "./Modal.module.css"

export default function Modal({ children, active, setActive, childrenClass, parentClass }) {
    return createPortal(
        <div className={active ? `${styles.modal} ${styles.active} ${parentClass}` : `${styles.modal} ${parentClass}`} onClick={() => setActive(false)}>
            <div className={active ? `${styles.modal_content} ${styles.active} ${childrenClass}` : `${styles.modal_content} ${childrenClass}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    )
}