import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

function PrivateRoutes() {
  const isAuthenticated = localStorage.getItem('token');
  const [isAuth, setIsAuth] = useState();

  const serverURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isAuthenticated == null) {
      setIsAuth(false);
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
      setIsAuth(response);

      return isAuth;
    };

    checkTokenWithIdOnServer(isAuthenticated);
  }, [isAuthenticated]);

  if (isAuth === undefined) return <Loader />;

  return (
    isAuth ? <Outlet /> : <Navigate to="/" />
  );
}

export default PrivateRoutes;
