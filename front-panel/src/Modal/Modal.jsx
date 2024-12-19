import React from "react";
import "./Modal.css"

export default function Modal ({children, active, setActive}) {
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active ? "modal_content active" : "modal_content"} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}