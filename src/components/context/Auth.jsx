import { createContext, useState } from "react";

export const Auth = createContext();

export const AuthProvider = ({children}) =>{
    const userInfo = localStorage.getItem('userInfo');
    const [user,setUser] = useState(userInfo);

    const login = (user) =>{
        setUser(user)
    }
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    }
    return <Auth.Provider value={{
        user,
        login,
        logout
    }}>
        {children}
        </Auth.Provider>
        
}
