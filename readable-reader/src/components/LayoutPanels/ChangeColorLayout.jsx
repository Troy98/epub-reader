import React from 'react';

function ChangeColorLayout(props) {
  const {
    onChange, defaultValue,
  } = props;

  const [editingValue, setEditingValue] = React.useState(defaultValue);

  const colorSchemes = [
    {
      id: 1,
      textColor: '#f8e701',
      backgroundColor: '#000000',
      accentColor: {
        tailwindFormat: 'purple',
        hexFormat: '#A855F7',
      },
    },
    {
      id: 2,
      textColor: '#ffffff',
      backgroundColor: '#000000',
      accentColor: {
        tailwindFormat: 'accent',
        hexFormat: '#3D5AB8',
      },
    },
    {
      id: 3,
      textColor: '#000000',
      backgroundColor: '#f8e701',
      accentColor: {
        tailwindFormat: 'purple',
        hexFormat: '#A855F7',
      },
    },
    {
      id: 4,
      textColor: '#000000',
      backgroundColor: '#ffffff',
      accentColor: {
        tailwindFormat: 'accent',
        hexFormat: '#3D5AB8',
      },
    },
    {
      id: 5,
      textColor: '#ffffff',
      backgroundColor: '#0a0f7d',
      accentColor: {
        tailwindFormat: 'white',
        hexFormat: '#FFFFFF',
      },
    },
    {
      id: 6,
      textColor: '#0a0f7d',
      backgroundColor: '#ffffff',
      accentColor: {
        tailwindFormat: 'red',
        hexFormat: '#EF4444',
      },
    },
    {
      id: 7,
      textColor: '#f8e701',
      backgroundColor: '#0a0f7d',
      accentColor: {
        tailwindFormat: 'white',
        hexFormat: '#FFFFFF',
      },
    },
  ];

  function doesValueMatchColorScheme(value, colorScheme) {
    return (
      value.backgroundColor === colorScheme.backgroundColor
      && value.textColor === colorScheme.textColor
      && value.accentColor.hexFormat === colorScheme.accentColor.hexFormat
    );
  }

  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {/* Display all colorSchemes in a separate clickable button square */}
      {colorSchemes.map((colorScheme) => (
        <button
          type="button"
          key={colorScheme.id}
          className="w-10 h-10 rounded-xl hover:brightness-90 border border-black"
          style={{
            backgroundColor: colorScheme.backgroundColor,
            color: colorScheme.textColor,
            boxShadow: `3px 3px 0 ${doesValueMatchColorScheme(editingValue, colorScheme)
              ? colorScheme.accentColor.hexFormat === '#FFFFFF' ? '#CFCFCF' : colorScheme.accentColor.hexFormat
              : 'transparent'}`,
          }}
          onClick={() => {
            setEditingValue(colorScheme);
            onChange(colorScheme);
          }}
        >
          ABC

        </button>
      ))}
    </div>
  );
}

export default ChangeColorLayout;
