import { deleteFetch, getFetch, postFetch, putFetch } from "../../utils/fetch/fetchUtil";

export const getBoardByProjectId = async (projectId) => await getFetch(`/api/board/${projectId}`)

export const addBoard = async (newBoard, projectId) => await postFetch(`/api/board/${projectId}`, { title: newBoard })

export const updateBoardNameById = async (updateColumnName, boardId) => putFetch(`/api/boards/${boardId}`, { title: updateColumnName })

export const deleteBoard = async (boardId, projectId) => deleteFetch(`/api/board/${boardId}/${projectId}`)
