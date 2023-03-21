import React from 'react';
import { useNavigate } from 'react-router-dom';
import LinkButton from './LinkButton';
import { closeSocket } from '../socket';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('isHelper');
    closeSocket();
    navigate('/');
  };

  return (
    <div className="fixed z-20 w-full h-16 bg-white">
      <div className="flex justify-between px-10 items-center h-full">
        <div className="flex items-center">
          <LinkButton
            to="/bibliotheek"
            text="Naar Bibliotheek"
          />
        </div>

        <div className="p-6 lg:text-xl text-slate-500 flex gap-x-1">
          Configuratiescherm voor
          <span className="text-accent-500 capitalize font-bold">{username}</span>
        </div>

        <button id="uitloggen" type="button" onClick={handleLogout}>
          <svg className="w-8 h-8 stroke-accent-500" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
