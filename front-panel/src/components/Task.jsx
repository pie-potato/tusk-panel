import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/Task.module.css"
import { useParams } from "react-router-dom";
import { useModal } from "../contexts/ModalContext";

export default function Task({ task }) {

    const [startDate, setStartDate] = useState(task.startDate ? new Date(task.startDate) : null);
    const [endDate, setEndDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const [progress, setProgress] = useState(0)
    const [progressBarColor, setProgressBarColor] = useState('')
    const { projectId } = useParams()
    const { isOpen, setTask, openModal } = useModal()

    useMemo(() => {
        const now = new Date().getTime();
        if (now < startDate) {
            setProgress(0)
            return;
        }

        if (now >= endDate) {
            setProgress(100)
            return;
        }
        const totalTime = endDate - startDate;
        const elapsedTime = now - startDate;

        const progressValue = (elapsedTime / totalTime) * 100;
        setProgress(progressValue > 100 ? 100 : progressValue)
        if (progress < 30) setProgressBarColor('#00ff00');
        if (progress < 70 && progress > 30) setProgressBarColor('#007bff');
        if (progress > 70) setProgressBarColor('#ff0000');
    }, [startDate, endDate, progress])

    useEffect(() => {
        setStartDate(task.startDate ? new Date(task.startDate) : null)
        setEndDate(task.endDate ? new Date(task.endDate) : null)
    }, [task]);

    useEffect(() => {
        if (isOpen) setTask(task)
    }, [task])

    return (
        <div className={styles.task} >
            <div onClick={() => openModal(task, projectId)}>
                <div className={styles.task_name}>{task.title}</div>
                <div className={styles.progress_bar}>
                    <div
                        className={styles.progress_bar_fill}
                        style={{ width: `${progress}%`, backgroundColor: `${progressBarColor}` }}
                    ></div>
                </div>
            </div>
        </div >
    )
}