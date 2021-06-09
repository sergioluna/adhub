/* App.js */

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import { useAuth, ProvideAuth } from './auth/use-auth';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CreatePage from './pages/CreatePage';

/**
 * Main App component rendered by index.js
 */
function App() {
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route exact path="/login">
                        <LoginPage />
                    </Route>
                    <Route exact path="/register">
                        <RegisterPage />
                    </Route>
                    <AuthenticatedRoute exact path="/account">
                        <AccountPage />
                    </AuthenticatedRoute>
                    <AuthenticatedRoute exact path="/logout">
                        <LogoutPage />
                    </AuthenticatedRoute>
                    <Route exact path="/create">
                        <CreatePage />
                    </Route>
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

/**
 * Route wrapper to redirect users to login if not authenticated
 */
function AuthenticatedRoute({ children, ...rest }) {
    const auth = useAuth();
    const redirect = (location) => (
        <Redirect to={ { pathname: '/login', state: { from: location } } } />
    );
    return (
    <Route
        render={({ location }) => 
            auth.user ? (children) : (redirect(location))
        }
    />
    );
}

export default App;
