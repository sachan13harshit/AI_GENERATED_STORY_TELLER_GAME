import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const { register, error, isAuthenticated } = useContext(AuthContext);
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

  const handleRegister = async (userData) => {
    setFormError('');
    const success = await register(userData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create an Account
      </h1>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <RegisterForm onSubmit={handleRegister} error={formError} />
        
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
