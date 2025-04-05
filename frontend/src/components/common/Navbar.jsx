import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-700">
            AI Storyteller
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                  Dashboard
                </Link>
                <div className="text-gray-700 ml-4">
                  {user?.name}
                </div>
                <Button
                  onClick={handleLogout}
                  className="ml-4 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;