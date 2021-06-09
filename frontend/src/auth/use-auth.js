/* use-auth.js */

import React, { 
    useState,
    useEffect,
    useContext,
    createContext 
} from 'react';


// context to be provided with <ProvideAuth/> component
const authContext = createContext();

// Hook for child components to get the auth object 
export const useAuth = () => {
    return useContext(authContext);
}

/**
 * <ProvideAuth/> component
 * 
 * Makes auth object available to any child component that calls uesAuth().
 * Checks for signed-in users in localStorage on fresh page load.
 */
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            auth.refreshJWT();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

/**
 * useProvideAuth 
 * 
 * Provider hook that creates auth object (user) and handles state
 */
function useProvideAuth() {
    const [user, setUser] = useState();

    /**
     * Function: refreshJWT
     * 
     * Sends POST request to /api/token/refresh/ with refresh token stored
     * in localStorage. 
     * Stores new access token in localStorage and keeps user signed in 
     * upon success.
     * Signs user out upon failure.
     */
    const refreshJWT = async () => {
        const userObjectInStorage = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await fetch('/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'refresh': userObjectInStorage.jwt_refresh
                })
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                setUser(() => {
                    const newUserObject = {
                        ...userObjectInStorage,
                        jwt_access: jsonResponse.access
                    }
                    localStorage.setItem("user", JSON.stringify(newUserObject));
                    return newUserObject
                });
            }
            else {
                setUser(null);
                localStorage.removeItem('user')
            }
    
        } catch (error) {
            console.log(error)
            setUser(null);
            localStorage.removeItem('user');
        }
    }

    /**
     * Function: signin
     * 
     * Sends POST request to /api/token/ with username and password passed
     * through parameters. 
     * Updates auth object (user) and localStorage with user/jwt_token then
     * calls onSuccess callback upon successful login
     * Calls onFailure otherwise.
     */
    const signin = async (username, password, onSuccess, onFailure) => {
        try {
            const response = await fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                const userObject = {
                    username: username,
                    jwt_access: jsonResponse.access,
                    jwt_refresh: jsonResponse.refresh
                };
                setUser(() => {
                    localStorage.setItem("user", JSON.stringify(userObject));
                    return userObject;
                });
                onSuccess();
            }
            else {
                onFailure(response);
            }
        } catch (error) {
            console.log(error);
            onFailure();
        }
    }

    /**
     * Function: signup
     * 
     * Sends post request to /api/users/ with data passed through parameters.
     * Calls onSuccess upon success, calls onFailure otherwise
     */
    const signup = async (email, username, password, onSuccess, onFailure) => {
        try {
            const response = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            if (response.ok) {
                onSuccess();
            }
            else {
                onFailure(response);
            }
        } catch (error) {
            onFailure();
        }
    }

    /**
     * Function: signout
     * 
     * Sets auth object (user) to null and removes user info from localStorage.
     * Calls callback function afterwards.
     */
    const signout = (callback) => {
        setUser(null);
        localStorage.removeItem('user');
        callback();
    }

    return {
        user,
        refreshJWT,
        signin,
        signup,
        signout
    };
}