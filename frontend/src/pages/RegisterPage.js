/* RegisterPage.js */

import Navbar from '../components/Navbar';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
    return (
        <div>
            <Navbar />
            <RegisterPageContent />
        </div>
    );
}

function RegisterPageContent() {
    return (
        <div className="container">
            <div className="row justify-content-center pt-sm-1 pt-md-2 pt-lg-4 pt-xl-5">
                <div className="col-12 col-md-8 col-lg-6 col-xlg-4 p-2">
                    <RegisterCard />
                </div>
            </div>
        </div>
    );
}

function RegisterCard() {
    return (
        <div className="card">
        <div className="card-body">
            <h2 className="text-center">Create Account</h2>
            <RegisterForm />
        </div>
    </div>

    );
}

export default RegisterPage;