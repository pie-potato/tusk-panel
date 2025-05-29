import styles from "./ContextMenu.module.css"

export default function ContextMenu({ children, ...props }) {
    return (
        <div {...props} className={styles.menu} tabIndex={0}>
            <div>...</div>
            <div className={styles.submenu}>
                {children}
            </div>
        </div>
    )
} 