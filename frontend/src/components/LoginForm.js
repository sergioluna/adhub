/* LoginForm.js */

import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/use-auth';

function LoginForm() {
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();
    const [form, setForm] = useState({
        emailInput: "",
        passwordInput: ""
    });

    //set redirect location to previous page or account overview if there is none 
    let { from } = location.state || { from: { pathname: '/account' } };

    const login = (email, password) => {
        auth.signin(email, password, () => {
            history.replace(from);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        event.target.classList.add('was-validated');

        if (event.target.checkValidity()) {
            login(form.emailInput, form.passwordInput);
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
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default LoginForm;