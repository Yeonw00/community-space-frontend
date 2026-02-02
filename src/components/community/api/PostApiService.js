import { apiClient } from "./ApiClient"

export const retrieveAllPostsApi
    = () => apiClient.get('/jpa/posts')

export const retrieveAllPostsForUsernameApi
    = (username) => apiClient.get(`/jpa/posts/${username}`)

export const deletePostApi
    = (id) => apiClient.delete(`/jpa/posts/${id}`)

export const retrievePostApi
    = (id) => apiClient.get(`/jpa/post/${id}`)

export const updatePostApi
    = (id, post) => apiClient.put(`/jpa/posts/${id}`, post)

export const createPostApi
    = (post) => apiClient.post('/jpa/posts', post)

export const uploadPhotoApi
    = (formData) => apiClient.post('/upload/photo', formData)

export const deletrphotoApi
    = (date, uuid) => apiClient.delete(`/upload/photo/${date}/${uuid}`)   

export const searchPostsByFieldApi = (field, query) => 
    apiClient.get('/index', {
        params: {
        field: field,
        query: query,
        }
    })