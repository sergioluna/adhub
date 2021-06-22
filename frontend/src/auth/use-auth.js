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
        if (localStorage.getItem("refresh_token")) {
            auth.refreshAccessTokens();
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
     * Function: authenticatedFetch
     * 
     * Makes an authenticated request to the provided url with the 
     * provided data. Reattempts request if it orignially returns 401.
     */
    const authenticatedFetch = async (url, options) => {
        // get access token form localStorage
        const accessToken = localStorage.getItem("access_token")
        // if no access token, logout (will redirect)
        if (!accessToken) {
            signout(() => {
                console.error("User was logged out.");
            });
            return null;
        }
        // set null headers for ... syntax on next variable declaration
        if (!options) {
            options = { headers: { } };
        }
        // construct request object with provided options and access token
        const requestObject = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': 'Bearer ' + accessToken
            }
        };
        try {
            // try request and get response
            const response = await fetch(url, requestObject);
            // if unauthorized (access token expired) try again with new tokens
            if (response.status === 401 && 
                response.statusText === 'Unauthorized'){
                    // update access tokens in localStorage
                    await this.refreshAccessTokens();
                    const newAccessToken = localStorage.getItem("access_token");
                    // throw error if refreshAccessToken fails (will log out)
                    if (!newAccessToken) {
                        throw new Error('User has been logged out');
                    }
                    // create new requestObject with updated access tokens
                    const updatedRequestObject = {
                        ...requestObject,
                        headers: {
                            ...requestObject.headers,
                            'Authorization': 'Bearer ' + newAccessToken
                        }
                    };
                    // attempt request again and return response
                    const newResponse = await fetch(url, updatedRequestObject);
                    return newResponse;
                }
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Function: refreshAccessTokens
     * 
     * Will refresh tokens in localStorage and set user with a POST request
     * to /api/token/refresh/
     * In case of failure, removes user from state and clears localStorage
     * (logging the user out)
     */
    const refreshAccessTokens = async () => {
        const usernameInStorage = localStorage.getItem("user");
        const refreshTokenInStorage = localStorage.getItem("refresh_token")
        try {
            const response = await fetch('/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'refresh': refreshTokenInStorage
                })
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                localStorage.setItem("access_token", jsonResponse.access)
                localStorage.setItem("refresh_token", jsonResponse.refresh)
                setUser(() => ({username: usernameInStorage}));
            }
            else {
                throw new Error('Could not refresh access token.')
            }
    
        } catch (error) {
            console.log(error)
            setUser(null);
            localStorage.clear();
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
                localStorage.setItem("user", username);
                localStorage.setItem("access_token", jsonResponse.access);
                localStorage.setItem("refresh_token", jsonResponse.refresh);
                setUser(() => ({username: username}));
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
        localStorage.clear();
        callback();
    }

    return {
        user,
        authenticatedFetch,
        refreshAccessTokens,
        signin,
        signup,
        signout
    };
}