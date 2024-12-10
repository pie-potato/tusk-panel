import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ... other imports

function Board({ boardId }) { // Receive boardId as a prop
    const [columns, setColumns] = useState([]);
    // ... other state for new column and editing

    useEffect(() => {
        fetchColumns();
    }, [boardId]);  // Add boardId to dependency array

    const fetchColumns = async () => {
        try {
            const response = await axios.get(`/api/boards/${boardId}/columns`); // Fetch columns for the specific board
            setColumns(response.data);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    // ... functions for creating and editing columns (similar to previous example, but now include boardId)
    const createColumn = async (newColumnTitle) => {
        try {

            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

            await axios.post('/api/columns', { title: newColumnTitle, boardId }, {  // Send boardId
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchColumns();

        } catch (error) {
            console.error("Error creating column:", error);
        }
    };

    return (
        <div>
            {/* ... Display columns and column creation form */}
        </div>
    );
}