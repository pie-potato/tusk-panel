import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.css"

export default function Modal({ children, active, setActive, className }) {

    const modalRef = useRef()
    useEffect(() => {
        if (active && modalRef.current) {
            requestAnimationFrame(() => {
                modalRef.current.classList.add('active')
            })
        }
    }, [active])

    return (
        <div className={active ? `${styles.modal} ${styles.active}` : styles.modal} onClick={() => setActive(false)}>
            <div ref={modalRef} className={active ? `${styles.modal_content} ${styles.active} ${className}` : `${styles.modal_content} ${className}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}