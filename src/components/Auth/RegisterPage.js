import React, { useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions/auth.actions';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = ({ register }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        await register(username, password);
        navigate('/profile');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded space-y-4">
                <h2 className="text-xl font-bold">Register</h2>
                <input className="w-full p-2 rounded bg-gray-700" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" className="w-full p-2 rounded bg-gray-700" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className="bg-green-500 hover:bg-green-700 rounded px-4 py-2 w-full">Create account</button>
                <Link to="/login" className="text-blue-400 block text-center">Already have an account?</Link>
            </form>
        </div>
    );
};

export default connect(null, { register })(RegisterPage);
