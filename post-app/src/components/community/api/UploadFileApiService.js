import { apiClient } from "./ApiClient"

export const uploadPhotoApi
    = (file) => apiClient.post('/upload/photo', file)

export const deletephotoApi
    = (date, uuid) => apiClient.delete(`/upload/photo/${date}/${uuid}`)   