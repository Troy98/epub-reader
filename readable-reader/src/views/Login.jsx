import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import Form from '../components/Form';
import FormContainer from '../components/FormContainer';
import Checkbox from '../components/Checkbox';
import { openSocket } from '../socket';

const serverURL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [username, setUsername] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [isHelper, setIsHelper] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/bibliotheek');
    }
  }, [navigate]);

  const loginUser = async () => {
    setDisabled(true);

    try {
      const result = await fetch(`${serverURL}/api/v1/reader/users`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      });

      if (!result.ok) {
        const errorMsg = await result.text();
        throw new Error(errorMsg);
      }

      const data = await result.json();

      localStorage.setItem('username', data.username);
      localStorage.setItem('token', JSON.stringify(data._id));

      if (isHelper) {
        localStorage.setItem('isHelper', isHelper);
      } else {
        localStorage.removeItem('isHelper');
      }

      navigate('/bibliotheek');
      openSocket();
      toastr.success(`${username} ingelogd!`);
    } catch (err) {
      const message = JSON.parse(err.message).error;
      setError(message);
    } finally {
      setDisabled(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    loginUser();
  };

  const handleUsernameChange = (e) => {
    const name = e.target.value;
    if (name.trim().length < 0) {
      setError('Een gebruikersnaam mag niet leeg zijn');
    } else {
      setUsername(name);
      setDisabled(false);
    }
  };

  return (
    <FormContainer
      title="Inloggen"
      form={(
        <Form
          infoText="Nog geen account? "
          to="/registreren"
          infoActionText="Registreer nu"
          buttonText="Inloggen"
          disabled={disabled}
          onSubmit={onSubmit}
          username={username}
          handleUsernameChange={handleUsernameChange}
          error={error}
          checkbox={(
            <Checkbox
              title="Klik hier om in te loggen als helper"
              onChange={() => { setIsHelper(!isHelper); }}
            />
          )}
        />
      )}
    />
  );
}

export default Login;
