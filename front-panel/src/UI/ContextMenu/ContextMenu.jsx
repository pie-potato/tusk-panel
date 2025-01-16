import React from "react";
import "./ContextMenu.css"

export default function ContextMenu({ children, refelement, corectx, corecty, ...props }) {
    return (
        <div
            {...props}
            className="context_menu"
            style={{ transform: `translate(${refelement.current.getBoundingClientRect().left + corectx}px, ${refelement.current.getBoundingClientRect().top + corecty}px)` }}
        >
            {children}
        </div>
    )
} 