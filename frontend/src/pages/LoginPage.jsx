import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { login, error, isAuthenticated } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleLogin = async (credentials) => {
    setFormError('');
    const success = await login(credentials);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Welcome Back
      </h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoginForm onSubmit={handleLogin} error={formError} />
        
        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
