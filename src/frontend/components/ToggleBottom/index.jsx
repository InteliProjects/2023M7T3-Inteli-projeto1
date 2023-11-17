// components/ToggleSwitch.js
import React, { useState } from 'react';

function ToggleSwitch({ initialState = false, onToggle }) {
  const [isChecked, setIsChecked] = useState(initialState);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="toggle-input"
      />
      <div className="slider"></div>
    </label>
  );
}

export default ToggleSwitch;
