/* Navbar.js */

import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../auth/use-auth';

/**
 * Renders navigation bar
 */
function Navbar(props) {
    return (
        <div className="container-fluid bg-light py-0">
            <div className="row align-items-center justify-content-center">
                <div className="col-6 order-1 col-md-3">
                    <NavbarLogo />
                </div>
                <div className="col-11 order-3 py-2 col-md-6 order-md-2 py-md-0">
                    {props.hasSearch ? <NavbarSearch /> : null}
                </div>
                <div className="col-6 order-2 col-md-3 order-md-3">
                    <NavbarLinks />
                </div>
            </div>
        </div>
    );
}


/**
 *  Renders navbar logo
 */
function NavbarLogo() {
    return (
        <Link className="display-2 m-0 text-decoration-none text-reset" to="/">Adhub</Link>
    );
}


/**
 *  Renders navbar search field and button
 */
function NavbarSearch() {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(() => event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        alert("search query: " + value);
    }
    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                value={value} onChange={handleChange}/>
            <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>
    );
}


/**
 * Renders navbar links
 */
function NavbarLinks(props) {
    return (
        <div className="row row-cols-1 text-end">
            <div className="col">
                <AccountMenuDropdown />
            </div>
            <div className="col">
                <ButtonLink to="/create" text="Post An Ad" />
            </div>
            <div className="col">
                <EmailButtonLink email="help@example.com" />
            </div>
        </div>
    );
}


/**
 * Renders dropdown menu for account links
 */
function AccountMenuDropdown(props) {
    const auth = useAuth();
    const history = useHistory();

    const authenticatedLinks = {
        '/account': 'Account Overview'
    }
    const unauthenticatedLinks = {
        '/login': 'Login',
        '/register': 'Create Account'
    }

    const links = auth.user ? authenticatedLinks : unauthenticatedLinks;

    return (
        <div className="dropdown">
            <button className="btn btn-light dropdown-toggle text-primary" type="button" id="accountMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                { auth.user ? auth.user.username : 'My Account' }
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountMenuDropdown">
                {Object.keys(links).map((key) => 
                    <Link key={key} to={key} className="dropdown-item">{links[key]}</Link>
                )}
                {/* include a logout button if user is logged in */}
                { auth.user ? <li><button className="dropdown-item" onClick={ () => {auth.signout(() => {history.push('/')})} }>Logout</button></li> : null}
            </ul>
        </div>
    );
}


/**
 *  Button-styled react-router Link
 */
function ButtonLink(props) {
    return(
        <Link to={props.to}>
            <button type="button" className="btn btn-light text-primary">
                {props.text}
            </button>
        </Link>
    )
}


/**
 *  Button-styled react-router Link for emails
 */
function EmailButtonLink(props) {
    return (
        <ButtonLink to={"mailto:"+props.email} text={props.email} />
    );
}


// Type checking with PropTypes
Navbar.propTypes = {
    hasSearch: PropTypes.bool,
    isAuthenticated: PropTypes.bool
}

ButtonLink.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

EmailButtonLink.propTypes = {
    email: PropTypes.string.isRequired
}


export default Navbar;