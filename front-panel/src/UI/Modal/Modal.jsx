import React, { useEffect, useRef } from "react";
import "./Modal.css"

export default function Modal({ children, active, setActive }) {

    const modalRef = useRef()
    useEffect(() => {
        if (active && modalRef.current) {
            requestAnimationFrame(() => {
                modalRef.current.classList.add('active')
            })
        }
    }, [active])

    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div ref={modalRef} className="modal_content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}