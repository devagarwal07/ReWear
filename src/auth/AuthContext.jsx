import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import api from "../api";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app
export function AuthProvider({ children }) {
    const { user: clerkUser, isLoaded } = useUser();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoaded && clerkUser) {
            api.get(`/users/${clerkUser.id}`).then(res => setUser(res.data));
        }
    }, [clerkUser, isLoaded]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
