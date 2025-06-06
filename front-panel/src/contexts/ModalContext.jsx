import { createContext, useContext, useState } from "react";

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
    const [task, setTask] = useState({})
    const [projectId, setProjectId] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    // const [modalState, setModalState] = useState({
    //     isOpen: isOpen,
    //     task: taskdata,
    //     projectId: projectId
    // })

    const openModal = (taskData, projectId) => {
        setTask(taskData)
        setProjectId(projectId)
        setIsOpen(true)
    }

    const closeModal = () => {
        setTask({})
        setProjectId(null)
        setIsOpen(false)
    }


    return (
        <ModalContext.Provider value={{ task, projectId, isOpen, setTask, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}