import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import Checkbox from '../components/Checkbox';
import FormContainer from '../components/FormContainer';
import { openSocket } from '../socket';

const serverURL = process.env.REACT_APP_API_URL;

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState();
  const [isHelper, setIsHelper] = useState(false);

  const validateUserInput = (input) => {
    if (input.trim().length < 0) {
      return [false, 'Een gebruikersnaam mag niet leeg zijn'];
    }
    if (input.length > 20) {
      return [false, 'Een gebruikersnaam mag niet langer dan 20 karakters zijn'];
    }
    if (input.length <= 2) {
      return [false, 'Een gebruikersnaam moet op zijn minst 2 karakters lang zijn'];
    }
    return [true];
  };
  const registerUser = async () => {
    setDisabled(true);
    try {
      const registerResult = await fetch(`${serverURL}/api/v1/helper/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      });

      if (!registerResult.ok) {
        const errorMsg = await registerResult.text();
        throw new Error(errorMsg);
      }

      toastr.success(`${username} aangemaakt!`);
    } catch (err) {
      const message = JSON.parse(err.message).error;
      throw new Error(message);
    } finally {
      setDisabled(false);
    }
  };

  const loginUser = async () => {
    setDisabled(true);
    try {
      const loginResult = await fetch(`${serverURL}/api/v1/reader/users`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      });

      if (!loginResult.ok) {
        const errorMsg = await loginResult.text();
        throw new Error(errorMsg);
      }

      const data = await loginResult.json();

      localStorage.setItem('username', data.username);
      localStorage.setItem('token', JSON.stringify(data._id));

      if (isHelper) {
        localStorage.setItem('isHelper', isHelper);
      }

      navigate('/bibliotheek');
      openSocket();
    } catch (err) {
      const message = JSON.parse(err.message).error;
      throw new Error(message);
    } finally {
      setDisabled(false);
    }
  };

  const saveUser = async () => {
    try {
      await registerUser();
      await loginUser();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/bibliotheek');
    }
  }, [navigate]);

  const onSubmit = (e) => {
    e.preventDefault();

    saveUser();
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    const validation = validateUserInput(e.target.value);
    if (validation[0]) {
      setDisabled(false);
      setError('');
    } else {
      setDisabled(true);
      setError(validation[1]);
    }
  };

  return (
    <FormContainer
      title="Registreren"
      form={(
        <Form
          infoText="Al een account? "
          to="/"
          infoActionText="Inloggen"
          buttonText="Registreren"
          disabled={disabled}
          onSubmit={onSubmit}
          username={username}
          handleUsernameChange={handleUsernameChange}
          error={error}
          checkbox={(
            <Checkbox
              title="Klik hier om in te loggen als helper na registratie"
              onChange={() => { setIsHelper(!isHelper); }}
            />
          )}
        />
      )}
    />
  );
}

export default Register;
