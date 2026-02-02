import { createContext,useContext,useState } from "react";
import { retrieveUserByIdApi, retrieveUserByUsernameApi } from "../api/UserApiSerivce";
import { checkLogin } from "../api/AuthenticationApiService";

//1: Create a Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)



//2: Share the created context with other components
export default function AuthProvider({children}) {

    //3: Put some state in the context
    const [isAuthenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState(null)
    const [userId, setUserId] = useState(0)
    const [user, setUser] = useState(null)
    // const [token, setToken] = useState(null)

    async function login(username, password) {
        try {
            const response = await checkLogin(username, password)
       
            if(response.status === 200) {
                setAuthenticated(true)
                setUsername(username)
                // retrieveUserByUsernameApi(username)
                // .then(response => {
                setUserId(response.data.id)
                setUser(response.data)
                    // })       
                // .catch(error => console.log(error))
                return true
            } else {
                logout()
                return false
            }
        } catch(error) {
            logout()
            return false
        }
    }

    // async function login(username, password) {
    //     try {
    //         const response = await executeJwtAuthenticationService(username,password)
       
    //         if(response.status == 200) {
    //             const jwtToken = 'Bearer ' + response.data.token
    //             setAuthenticated(true)
    //             setUsername(username)
    //             setToken(jwtToken)
    //             retrieveUserByUsernameApi(username)
    //             .then(response => {
    //                 setUserId(response.data.id)
    //                 setUser(response.data)
    //                 })       
    //             .catch(error => console.log(error))

    //             apiClient.interceptors.request.use(
    //                 (config) => {
    //                     config.headers.Authorization = jwtToken
    //                     return config
    //                 }
    //             )
    
    //             return true
    //         } else {
    //             logout()
    //             return false
    //         }
    //     } catch(error) {
    //         logout()
    //         return false
    //     }
    // }

    function logout() {
        setAuthenticated(false)
        setUsername(null)
        setUserId(0)
        // setToken(null)
        setUser(null)
    }

    function changeInformation(userId) {
        retrieveUserByIdApi(userId)
        .then(response => {
            console.log(response.data)
            setUser(response.data)
            console.log('-----')
            console.log(response.data.male)
        })
        .catch(error => console.log(error))
    }


    return (
        <AuthContext.Provider value ={{isAuthenticated, login, logout, changeInformation, username, userId, user}}>
            {children}
        </AuthContext.Provider>
    )
}