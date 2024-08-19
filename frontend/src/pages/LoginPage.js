import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Log username and password to verify their values

        try {
            // Ensure the URL is complete with protocol
            // const response = await axios.post('http://localhost:5000/api/auth/login', {
            const response = await axios.post('https://sports-allocation-system.onrender.com/api/auth/login', {
                username,
                password
            });

            const { data } = response;
            // Assuming the response has user info and role
            const { _id, username: user, role, token } = data;

            // Store user info in local storage or state management
            localStorage.setItem('userInfo', JSON.stringify({ _id, username: user, role, token }));

            // Redirect based on user role
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'student') {
                navigate('/student');
            } else {
                setError('Unknown role');
            }
        } catch (error) {
            console.error('Login error:', error); // Log error for debugging
            setError('Invalid username or password');
        }
    };

    return (
        <>
            <nav className="navbar navbar-light">
                <div className="container d-flex justify-content-center align-items-center">
                    <span className="navbar-brand d-flex align-items-center">
                        <h1 className="ms-2 mb-0">Sports Item Allocation System</h1>
                    </span>
                </div>
            </nav>

            <div className="container mt-5">
                <div className="card">
                    <div className="card-header text-white">
                        Login
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
