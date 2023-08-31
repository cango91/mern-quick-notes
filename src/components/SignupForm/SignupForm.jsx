import { useState } from "react";
import { signup } from "../../utilities/users-service";

const initialState = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    error: '',
}

export default function SignupForm({ setUser }) {
    const [state,setState] = useState(initialState);
    const disable = state.password !== state.confirm;
    const handleChange = (e) =>{
        setState({...state,[e.target.name]:e.target.value});
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const formData = {...state};
            delete formData.confirm;
            delete formData.error;
            const user = await signup(formData);
            setUser(user);
            if(user){
                window.location.href = '/notes';
            }
        } catch (error) {
            setState({...state,error: 'Signup failed! Try again.'});
        }
    }

    return (
        <div>
            <div className="form-container">
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input autoComplete="name" type="text" name="name" value={state.name} onChange={handleChange} required />
                    <label>Email</label>
                    <input autoComplete="email" type="email" name="email" value={state.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input autoComplete="new-password" type="password" name="password" value={state.password} onChange={handleChange} required />
                    <label>Confirm</label>
                    <input autoComplete="off" type="password" name="confirm" value={state.confirm} onChange={handleChange} required />
                    <button type="submit" disabled={disable}>SIGN UP</button>
                </form>
            </div>
            <p className="error-message">&nbsp;{state.error}</p>
        </div>
    );
}