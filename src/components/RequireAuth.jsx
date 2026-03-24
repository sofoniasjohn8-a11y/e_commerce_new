import { useContext } from "react"

import { Navigate } from "react-router-dom";

import { Auth } from "./context/Auth";

export const RequireAuth = ({children}) =>{
    const {user} = useContext(Auth);

    if(!user){
        return <Navigate to="/account/login"/>
    }
    return children;
} 