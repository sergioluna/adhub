/* use-auth.js */

import React, { useState, useContext, createContext } from 'react';

const authContext = createContext();

// Provider component that wraps app and makes auth object 
// ... available to any child component that calls useAuth()
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

// Hook for child components to get the auth object and
// ... re-render when it changes
export const useAuth = () => {
    return useContext(authContext);
}

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState();

    const signin = (email, password, callback) => {
        setUser(email);
        callback();
    }

    const signup = (email, password, callback) => {
        setUser(email);
        callback();
    }

    const signout = (callback) => {
        setUser(false);
        callback();
    }

    return {
        user,
        signin,
        signup,
        signout
    };
}