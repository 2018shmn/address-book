import {useState} from 'react';

const LoginForm = ({onLogin, onSignup}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                await onLogin(email, password);
            }
            else {
                await onSignup(email, password);
            }
        }
        catch (error) {
            switch(error.code){
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    alert('Invalid email or password');
                    break;
                case 'auth/email-already-in-use':
                    alert('Email is already in use');
                    break;
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters');
                    break;
                case 'auth/invalid-email':
                    alert('Invalid email address');
                    break;
                default:
                    alert('An error occurred. Please try again.');
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className ="login-form">
                <h2>{isLogin ? 'Login' : 'Create Account'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                    </div>

                    <button
                    type="submit"
                    className="button-submit"
                    disabled={isLoading}>
                        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className = "form-switch">
                    <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;