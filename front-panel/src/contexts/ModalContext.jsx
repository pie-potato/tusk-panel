import { createContext, useContext, useState } from "react";

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
    const [task, setTask] = useState({})
    const [projectId, setProjectId] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, deleteFunc: () => { } })
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
    const confirmOpen = (deleteFunc) => {
        setConfirmDelete({
            isOpen: true,
            deleteFunc: deleteFunc
        })
    }
    const confirmClose = () => {
        setConfirmDelete({
            isOpen: false,
            deleteFunc: () => { }
        })
    }


    return (
        <ModalContext.Provider value={{ task, projectId, isOpen, setTask, openModal, closeModal, confirmDelete, confirmOpen, confirmClose }}>
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