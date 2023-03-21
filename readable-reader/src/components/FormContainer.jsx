import React from 'react';

function FormContainer(props) {
  const { form, title } = props;
  return (
    <div className="flex flex-col min-h-screen items-center bg-gradient-to-tr from-fuchsia-300 to-accent-100
    justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0"
      >
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            {title}
          </h1>

          {form}
        </div>
      </div>
    </div>
  );
}

export default FormContainer;