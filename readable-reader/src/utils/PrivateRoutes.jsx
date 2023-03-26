import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function PrivateRoutes() {
  const isAuthenticated = localStorage.getItem('token');
  const [isAuth, setIsAuth] = useState(isAuthenticated !== null);
  const [isLoading, setIsLoading] = useState(isAuthenticated !== null);
  const navigate = useNavigate();

  const serverURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isAuthenticated === null) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }
    const checkTokenWithIdOnServer = async (token) => {
      const id = token.replaceAll('"', '');
      const response = await fetch(`${serverURL}/api/v1/reader/users/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
      setIsAuth(response.ok);
      setIsLoading(false);
    };

    checkTokenWithIdOnServer(isAuthenticated);
  }, [isAuthenticated, serverURL]);

  useEffect(() => {
    if (!isAuth && !isLoading) {
      navigate('/');
    }
  }, [isAuth, isLoading, navigate]);

  if (isLoading) return <Loader />;

  return isAuth && <Outlet />;
}

export default PrivateRoutes;
