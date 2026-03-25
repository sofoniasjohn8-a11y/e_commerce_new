import { useContext } from "react"

import { Navigate, useLocation } from "react-router-dom";

import { Auth } from "./context/Auth";

export const RequireAuth = ({children}) =>{
    const {user} = useContext(Auth);
    const location = useLocation();

    if (!user) {
        // Redirect to login, but save the current location in state
        return <Navigate to="/account/login" state={{ from: location }} replace />;
    }
    
    return children;
} 