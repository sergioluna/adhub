/* Login.js */

import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';

function LoginPage() {
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
                    <LoginCard />
                </div>
            </div>
        </div>
    );
}

function LoginCard() {
    return (
        <div className="card">
            <div className="card-body">
                <h2 className="text-center">Login</h2>
                <LoginForm />
            </div>
        </div>
    );
}



export default LoginPage;