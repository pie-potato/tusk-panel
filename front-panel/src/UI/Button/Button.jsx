import { Link } from "react-router-dom";
import styles from "./Button.module.css"

const Button = ({ onClick, children, className, href }) => {
    return (
        href
            ?
            <Link onClick={onClick} className={`${styles.button} ${className}`} to={href}>
                {children}
            </Link>
            :
            <button onClick={onClick} className={`${styles.button} ${className}`}>
                {children}
            </button>
    )
}

export default Button;
