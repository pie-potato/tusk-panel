import React from "react";
import "./ContextMenu.css"

export default function ContextMenu ({children, elementRef, corectX, corectY}) {
    return (
        <div className="context_menu">
            {children}
        </div>
    ) 
} 