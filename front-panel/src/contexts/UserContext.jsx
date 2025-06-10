import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";

const { createContext } = require("react");

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user])

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                const newData = e.newValue ? JSON.parse(e.newValue) : null;
                
                setUser(newData);
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)