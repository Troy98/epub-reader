import React from 'react';

function Checkbox(props) {
  const { title, onChange } = props;
  return (
    <div className="flex items-center">
      <input
        id="default-checkbox"
        type="checkbox"
        value=""
        onChange={onChange}
        className="w-4 h-4 bg-gray-100 accent-accent-200 rounded border-gray-300 focus:ring-accent-200 dark:ring-offset-gray-800 focus:ring-2"
      />
      <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-neutral-700">{title}</label>
    </div>
  );
}

export default Checkbox;
