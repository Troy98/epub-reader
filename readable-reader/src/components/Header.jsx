/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeSocket } from '../socket';
import TextButton from './TextButton';

function Header(props) {
  const { handleUploadClick, handleSwitchRole } = props;
  const navigate = useNavigate();
  const isHelper = localStorage.getItem('isHelper');

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('isHelper');
    closeSocket();
    navigate('/');
  };

  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  return (
    <div className="w-full lg:px-10 z-20 p-2 grid grid-cols-3 items-center justify-between">
      {isHelper && (
      <div className="flex flex-row gap-2">
        <TextButton
          text="Ebook uploaden"
          id="uploaden"
          onClick={handleUploadClick}
          styles="uploadButton"
        />
      </div>
      )}
      <TextButton
        styles={`flex justify-self-center ${!isHelper && 'col-start-2'}`}
        text={`Wissel naar ${isHelper ? 'reader' : 'helper'} `}
        onClick={handleSwitchRole}
      />
      {isHelper && (
      <button type="button" onClick={handleLogout} className={`stroke-${accentColorTailwindFormat}-500 justify-self-end`}>
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
      )}
    </div>
  );
}

export default Header;
