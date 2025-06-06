import styles from "./ContextMenu.module.css"

export default function ContextMenu({ children, subMenuButton = '...', ...props }) {
    return (
        <div {...props} className={styles.menu} tabIndex={0}>
            <div>{subMenuButton}</div>
            <div className={styles.submenu}>
                {children}
            </div>
        </div>
    )
} 