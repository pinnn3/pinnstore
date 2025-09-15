
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SITE_NAME } from '../../constants';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation, username is fixed to 'admin'
        if (username !== 'admin') {
            setError('Invalid username or password.');
            return;
        }
        const success = login(password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 border border-cyan-500/20 rounded-lg shadow-lg shadow-cyan-500/10">
                <h1 className="text-3xl font-heading text-center text-cyan-400">{SITE_NAME} Admin</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            readOnly // Username is fixed
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
