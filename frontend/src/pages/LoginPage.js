/* LoginPage.js */

import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../auth/use-auth';

import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

 function LoginPage() {
    const auth = useAuth();
    const history = useHistory();

    /**
     * Function: redirectIfAuthenticated
     * 
     * Redirects if user has been authenticated
     */
    const redirectIfAuthenticated = () => {
        if(auth.user) {
            history.replace({ pathname: '/account' });
        }
    }
    
    useEffect(() => {
        redirectIfAuthenticated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth])
    
    return (
        <div>
            <Navbar />
            <LoginPageContent />
        </div>
    );
}

function LoginPageContent() {
    return (
        <div className="container">
            <div className="row justify-content-center pt-sm-1 pt-md-2 pt-lg-4 pt-xl-5">
                <div className="col-12 col-md-8 col-lg-6 col-xlg-4 p-2">
                    <Card title="Login">
                        <LoginForm />
                    </Card>
                </div>
            </div>
        </div>
    );
}


export default LoginPage;