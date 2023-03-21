import React from 'react';
import TextButton from './TextButton';
import LinkButton from './LinkButton';

function Form(props) {
  const {
    infoText, to, infoActionText, buttonText, disabled, onSubmit, username, handleUsernameChange,
    error, checkbox,
  } = props;
  return (
    <form className="flex flex-col gap-y-2" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-4">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm">
            Gebruikersnaam
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className={`${error && '!ring-accent-400'} outline-none bg-gray-50 border border-gray-300 
            focus:border-transparent text-gray-900 sm:text-sm rounded-lg ring-2 w-full p-2.5`}
            placeholder="Gebruikersnaam"
          />
        </div>
        <div>
          {checkbox}
          <div
            id="error"
            className={`h-min text-xs text-red-400 mt-2 pointer-events-none select-none 
             ${error ? 'visible' : 'invisible'}`}
          >
            {error || 'Geen problemen'}
          </div>
        </div>
      </div>
      <TextButton
        disabled={disabled}
        text={buttonText}
        type="submit"
        styles="!w-full !text-white !bg-accent-500"
      />
      <p className="text-sm flex gap-x-1 text-neutral-800">
        {infoText}
        <LinkButton
          to={to}
          text={infoActionText}
        />
      </p>
    </form>

  );
}

export default Form;
