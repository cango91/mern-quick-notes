import { useState, useEffect } from "react";
import { login } from "../../utilities/users-service";

export default function LoginForm({ setUser }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        if(urlError){
            switch(urlError){
                case 'expired':
                default:
                    setError('Session expired, please login again');
            }
        }
    },[error]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const user = await login(formData);
            setUser(user);
            if (user) {
                window.location.href = '/notes';
            }
        } catch (error) {
            setError('Could not log you in. Try again.');
        }
    }


    return (
        <div>
            <div className="form-container">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input autoComplete="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input autoComplete="current-password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">LOG IN</button>
                </form>
            </div>
            <p className="error-message">&nbsp;{error}</p>
        </div>
    );
}