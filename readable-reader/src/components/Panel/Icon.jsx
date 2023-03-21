import React from 'react';
import { useSelector } from 'react-redux';

function Icon(props) {
  const { icon, styles } = props;

  const { accentColorTailwindFormat } = useSelector((state) => state.users);

  return (
    <div className={`icon-top-left relative bg-${accentColorTailwindFormat !== 'white'
      ? accentColorTailwindFormat : 'accent'}-500 ${styles || 'w-32 h-32'}`}
    >
      {icon}
    </div>
  );
}

export default Icon;
