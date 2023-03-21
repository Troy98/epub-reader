import React from 'react';
import { Link } from 'react-router-dom';

function LinkButton(props) {
  const { text, to } = props;
  return (
    <Link
      to={to}
      className="font-medium text-accent-500 hover:underline"
    >
      {text}
    </Link>
  );
}

export default LinkButton;
