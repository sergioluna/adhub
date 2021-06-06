/* RegisterForm.js */

import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

function RegisterForm() {
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();
    const [form, setForm] = useState({
        emailInput: "",
        passwordInput: "",
        passwordConfirmationInput: ""
    });

    //set redirect location to previous page or account overview if there is none 
    let { from } = location.state || { from: { pathname: '/account' } };


    const register = (email, password) => {
        auth.signup(email, password, () => {
            history.replace(from);
        });
    } 

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        event.target.classList.add('was-validated');

        if (event.target.checkValidity()) {
            register(form.emailInput, form.passwordInput);
        }
    }

    const handleChange = (event) => {
        setForm((prev) => ({
            ...prev, 
            [event.target.name]: event.target.value
        }));
    }

    return (
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" 
                    name="emailInput" value={form.emailInput} onChange={handleChange} required/>
                <div className="invalid-feedback">
                    Please provide a valid email.
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput"
                    name="passwordInput" value={form.passwordInput} onChange={handleChange} required/>
                <div className="invalid-feedback">
                    Please provide a valid password.
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordConfirmationInput" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="passwordConfirmationInput"
                    name="passwordConfirmationInput" value={form.passwordConfirmationInput} onChange={handleChange} required pattern={form.passwordInput}/>
                <div className="invalid-feedback">
                    Please make sure passwords match.
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>

    );
}

export default RegisterForm;