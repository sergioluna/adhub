/* RegisterForm.js */

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

const CONSTANTS = {
    EMPTY_INPUT: {
        email: "",
        username: "",
        password: "",
        passwordConfirmation: ""
    },
    NO_ERRORS: {
        email: "",
        username: "",
        password: "",
        passwordConfirmation: "",
        other: ""   
    },
    SERVER_ISSUE_ERROR: {
        other: "There was a problem with our server. Please try again later."
    },
    NO_EMAIL_ERROR: {
        email: "Please provide an email."
    },
    NO_USERNAME_ERROR: {
        username: "Please provide a username."
    },
    NO_PASSWORD_ERROR: {
        password: "Please provide a password."
    },
    PASSWORD_CONFIRMATION_ERROR: {
        passwordConfirmation: "Passwords do not match."
    }
}

/**
 * RegisterForm component
 * 
 * Renders registration form with submission and error-handling functionality
 */
function RegisterForm() {

    const history = useHistory();
    const auth = useAuth();

    const [userInput, setUserInput] = useState(CONSTANTS.EMPTY_INPUT);
    const [errors, setErrors] = useState(CONSTANTS.NO_ERRORS);

    /**
     * Function: addError
     * 
     * Adds error object to errors
     */
    const addError = (newError) => {
        setErrors((prev) => ({
            ...prev,
            ...newError
        }));
    }
    
    
    /**
     * Function: handleChange 
     * 
     * Handles change in inputs 
     */
    const handleChange = (event) => {
        setUserInput((prev) => ({
            ...prev, 
            [event.target.name]: event.target.value
        }));
    }
    

    /**
     * Function: handleSubmit
     * 
     * Handles form submission
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        //confirm input is valiid and attempt registratiiion
        if (userInputIsValid()) {
            attemptRegistration(
                userInput.email,
                userInput.username,
                userInput.password
            );
        }
    }

    /**
     * Function: userInputIsValid
     * 
     * Checks if use input is valid for submission
     */
    const userInputIsValid = () => {

        setErrors(CONSTANTS.NO_ERRORS);
        let isValid = true;

        if(!userInput.email) {
            addError(CONSTANTS.NO_EMAIL_ERROR);
            isValid = false;
        }
        if (!userInput.username) {
            addError(CONSTANTS.NO_USERNAME_ERROR);
            isValid = false;
        }
        if (!userInput.password) {
            addError(CONSTANTS.NO_PASSWORD_ERROR);
            isValid = false;
        }
        if (userInput.passwordConfirmation !== userInput.password) {
            addError(CONSTANTS.PASSWORD_CONFIRMATION_ERROR);
            isValid = false;
        }

        return isValid;
    }
    

    /**
     * Functiion: attemptRegistration
     * 
     * Attempts registration and handles response
     */
     const attemptRegistration = (email, username, password) => {
        // callback in case of success (login and redirect)
        const onRegistrationSuccess = () => {
            auth.signin(
                username,
                password,
                () => {history.replace({pathname: '/account'})},
                () => {}
            );
        }
        // callback in case of failure (set errors)
        const onRegistrationFailure = async (response) => {
            if(response && response.status === 400){
                let responseJson = await response.json();
                setErrors({
                    email: responseJson.email,
                    username: responseJson.username
                });
            } else {
                setErrors(CONSTANTS.SERVER_ISSUE_ERROR);
            }
        }
        // registration attempt
        auth.signup(
            email,
            username,
            password,
            onRegistrationSuccess,
            onRegistrationFailure
        );
    } 

    
    return (
        <form onSubmit={handleSubmit} noValidate>
            <EmailInput
                value={userInput.email}
                onChange={handleChange}
                errorMessage={errors?.email} />
            <UsernameInput
                value={userInput.username}
                onChange={handleChange} 
                errorMessage={errors?.username} />
            <PasswordInput
                value={userInput.password}
                onChange={handleChange}
                errorMessage={errors?.password} />
            <PasswordConfirmationInput
                value={userInput.passwordConfirmation}
                onChange={handleChange}
                errorMessage={errors?.passwordConfirmation} />
            <SubmitButton />
            <ServerErrorMessage errorMessage={errors?.other} />
        </form>
    );
}

/**
 * EmailInput component
 * 
 * Renders an InputField with values for an email field
 */
function EmailInput(props) {
    return (
        <InputField 
            id="emailInput"
            label="Email Address"
            type="email"
            name="email"
            value={props.value}
            onChange={props.onChange}
            errorMessage={props.errorMessage}
        />
    );
}

/**
 * UsernameInput component
 * 
 * Renders an InputField with values for a username field
 */
function UsernameInput(props) {
    return (
        <InputField
            id="usernameInput"
            label="Username"
            type="text"
            name="username"
            value={props.value}
            onChange={props.onChange}
            errorMessage={props.errorMessage}
        />
    );
}

/**
 * PasswordInput component
 * 
 * Renders an InputField with values for a password field
 */
function PasswordInput(props) {
    return (
        <InputField
            id="passwordInput"
            label="Password"
            type="password"
            name="password"
            value={props.value}
            onChange={props.onChange}
            errorMessage={props.errorMessage}
        />
    );
}

/**
 * PasswordConfirmationInput component
 * 
 * Renders an InputField with values for a password confirmation field
 */
function PasswordConfirmationInput(props) {
    return (
        <InputField
            id="passwordConfirmationInput"
            label="Confirm Password"
            type="password"
            name="passwordConfirmation"
            value={props.value}
            onChange={props.onChange}
            errorMessage={props.errorMessage}
        />
    );
}

/**
 * InputField component
 * 
 * Renders JSX for an input field with arguments passed thorugh props
 * 
 * props: id, label, type, name, value, onChange, errorMessage
 */
function InputField(props) {
    return (
        <div className="mb-3">
            <label htmlFor={props.id} className="form-label">
                {props.label}
            </label>
            <input
                id={props.id}
                type={props.type}
                name={props.name}
                className={props.errorMessage ? 
                    "form-control is-invalid" : 
                    "form-control"
                }  
                value={props.value}
                onChange={props.onChange}
            />
            <div className="invalid-feedback">
                {props.errorMessage}
            </div>
        </div>
    );
}

/**
 * SubmitButton component
 * 
 * Renders a submit button
 */
function SubmitButton() {
    return (
        <button type="submit" className="btn btn-primary">Submit</button>
    );
}

/**
 * ServerErrorMessage component
 * 
 * Renders error message if there is an 'other' property in errors object
 */
function ServerErrorMessage(props) {
    return (
        <p className="text-danger text-center mt-2">
            <small>
                {props.errorMessage}
            </small>
        </p>
    );
}


export default RegisterForm;