import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sehat-theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('sehat-theme', newDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      style={{
        background: 'none',
        border: '1px solid var(--border, #E2E8F0)',
        borderRadius: '50%',
        width: '38px',
        height: '38px',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}