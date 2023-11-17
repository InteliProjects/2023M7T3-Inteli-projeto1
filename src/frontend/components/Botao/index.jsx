// components/SimpleButton.js
import React from 'react';

const SimpleButton = ({ Name , onClick, label }) => {
  return (
    <button onClick={onClick} className={`simple-button ${Name}`}>
      {label}
    </button>
  );
}

export default SimpleButton;
