import { apiClient } from "./ApiClient"

export const retrieveUserByUsernameApi
    = (username) => apiClient.get(`/jpa/user/${username}`)

export const retrieveUserByIdApi
    = (id) => apiClient.get(`/jpa/users/${id}`)

export const createUserApi
    = (user) => apiClient.post('/jpa/users', user)

export const updateUserApi
    = (id, user) => apiClient.put(`/jpa/users/${id}`, user)
