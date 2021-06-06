/* App.js */

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { useAuth, ProvideAuth } from './auth/use-auth';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CreatePage from './pages/CreatePage';


function App() {
    return (
        <ProvideAuth>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <GuestOnlyRoute exact path="/login">
                        <LoginPage />
                    </GuestOnlyRoute>
                    <GuestOnlyRoute exact path="/register">
                        <RegisterPage />
                    </GuestOnlyRoute>
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

/**
 * Route wrapper to redirect users away from page if already authenticated
 */
function GuestOnlyRoute({ children, ...rest }) {
    const auth = useAuth();
    console.log('guestonly', auth.user)
    const redirect = (location) => (
        <Redirect to={ { pathname: '/', state: { from: location } } } />
    );
    return (
        <Route
            render={({ location }) => 
                auth.user ? (redirect(location)) : (children)
            }
        />
    );
}

export default App;
